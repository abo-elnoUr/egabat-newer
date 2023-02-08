import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibsCategs } from 'src/app/helpers/enums/libraries-categories.enum';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { GradeResponseDto } from 'src/app/helpers/_interfaces/grade';
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ICountryModel } from 'src/app/models/country.model';
import { IGrade } from 'src/app/models/grades.model';
import { CountryService } from 'src/app/shared/country.service';
import { CustomLibraryService } from '../../custom-library/service/custom-library.service';
import { GradesService } from '../../grades/API/grades.service';
import { SemesterService } from '../../semesters/service/semester.service';
import { StageHttpService } from '../../stages/API/stages-http.service';
import { LibrariesService } from '../libraries.service';

@Component({
  selector: 'app-create-library',
  templateUrl: './create-library.component.html',
  styleUrls: ['./create-library.component.scss']
})
export class CreateLibraryComponent implements OnInit {

  createLibraryForm!: FormGroup;
  gradeId: string = "";
  listOfSemsters: ISemester[] = []
  listOfCounrties: ICountryModel[] = []
  listOfStages: IStage[] = []
  listOfGrades: IGrade[] = []
  listOfSemester: any[] = []
  previewFile: string
  imageBlob: File
  imageName: string = ""
  fileBlob: File
  previewImage: string
  fileName: string = ""
  isSubmiting: boolean = false

  constructor(
    private _formBuilder: FormBuilder,
    private _activedRoute: ActivatedRoute,
    private _libraryService: LibrariesService,
    private _semesterService: SemesterService,
    private _router: Router,
    private _CountryService: CountryService,
    private _StageHttpService: StageHttpService,
    private _GradesService: GradesService,
    private _customLibraryService: CustomLibraryService,
    private _swal: SweetAlertService
  ) {
    this.createLibraryForm = this._formBuilder.group({
      name: ["", Validators.required],
      stageId: ["", Validators.required],
      gradeId: ["", Validators.required],
      semesterId: [null, Validators.required],
      countryId: ["", Validators.required],
      image: ['']
      // attachments: this._formBuilder.array([this.newAttachment()])
    });

    let gradeId = this._activedRoute.snapshot.params['gradeId'];
    this.gradeId = gradeId;
    this.getGradeById(gradeId)
  }


  ngOnInit(): void {
    this.getCountries();
    document.title = "المكتبات"
  }

  getLibraryImage(image: any) {
    this.createLibraryForm.get('image')?.setValue(image)
  }
  // get Attachments(): FormArray {
  //   return this.createLibraryForm.get('attachments') as FormArray
  // }

  // newAttachment() {
  //   return this._formBuilder.group({
  //     file_Title: [''],
  //     file_Image: [''],
  //     file_Pdf: ['']
  //   })
  // }

  // addNewAttachment() {
  //   this.Attachments.push(this.newAttachment())
  // }

  uploadImage(event: any) {
    // let fileItem = this.Attachments.controls[0] as FormGroup;
    let image = event.target.files[0]
    // fileItem.get("file_Image")?.setValue(image)
  }

  uploadPdf(event: any) {
    // let fileItem = this.Attachments.controls[0] as FormGroup;
    let pdf = event.target.files[0]
    // fileItem.get("file_Pdf")?.setValue(pdf)
  }

  setTitle(event: any) {
    // let fileTitle = this.Attachments.controls[0] as FormGroup;
    let pdf = event.target.value
    // fileTitle.get("file_Title")?.setValue(pdf)
  }

  libraryData: GradeResponseDto = {
    countryId: '',
    countryName: '',
    gradeId: '',
    gradeName: '',
    isActive: true,
    index: 0,
    stageId: '',
    stageName: ''
  };
  getGradeById(gradeId: string) {
    this._GradesService.getGeadeByID(gradeId).subscribe({
      next: (res) => {
        this.libraryData = res;
        this.createLibraryForm.patchValue({
          gradeId: res.gradeId,
          stageId: res.stageId,
          countryId: res.countryId
        })
      }
    })
  }


  getCountries() {
    this._CountryService.getAllCountries().subscribe({
      next: (res) => {
        this.listOfCounrties = res
        this.getStages()
      }
    })
  }

  getStages() {
    this._StageHttpService.getAllStages().subscribe({
      next: (res) => {
        this.listOfStages = res
        this.getGrades()
      }
    })
  }

  getGrades() {
    this._GradesService.getAllGrades({}).subscribe({
      next: (res) => {
        this.listOfGrades = res.grades
        this.getSemesters()
      }
    })
  }

  getSemesters() {
    this._semesterService.getSemesters().subscribe(response => {
      this.listOfSemsters = response
    })
  }

  createLibraryFormData() {
    let libraryForm = new FormData();

    libraryForm.append("name", this.createLibraryForm.get("name")?.value)
    libraryForm.append("gradeId", this.createLibraryForm.get("gradeId")?.value)
    libraryForm.append("stageId", this.createLibraryForm.get("stageId")?.value)
    libraryForm.append("semesterId", this.createLibraryForm.get("semesterId")?.value)
    libraryForm.append("countryId", this.createLibraryForm.get("countryId")?.value)
    libraryForm.append('image', this.createLibraryForm.get('image')?.value)
    // if (this.Attachments.length) {
    //   for (let f = 0; f < this.Attachments.controls.length; f++) {
    //     libraryForm.append(`attachments[${f}].file_Title`, this.Attachments?.controls[f]?.get("file_Title")?.value)
    //     libraryForm.append(`attachments[${f}].file_Pdf`, this.Attachments?.controls[f]?.get("file_Pdf")?.value)
    //     libraryForm.append(`attachments[${f}].file_Image`, this.Attachments?.controls[f]?.get("file_Image")?.value)
    //   }
    // }

    return libraryForm;
  }



  submit() {
    this.isSubmiting = true;
    this._customLibraryService.addLibrary(this.createLibraryFormData()).subscribe({
      next: (response) => {
        // console.log(response);
        this._swal.createSuccess()
        this.createLibraryForm.reset()
      }
    })

    // this._libraryService.createLibary(this.createLibraryFormData()).subscribe({
    //   next: (res) => {
    //     console.log('added');
    //   }
    // })

  }
}
