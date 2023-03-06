import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ICountryModel } from 'src/app/models/country.model';
import { IGrade } from 'src/app/models/grades.model';
import { ISection } from 'src/app/models/sections.model';
import { CountryService } from 'src/app/shared/country.service';
import { environment } from 'src/environments/environment';
import { SectionService } from '../../sections/api/section.service';
import { SubjectService } from '../Api/api-http.service';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {

  subjectForm: FormGroup
  subjectImage: File
  filterSubjectsForm: FormGroup
  isLoading: boolean = false
  countries$ = this._CountryService.countries$
  listOfSections: ISection[]
  listOfStages: IStage[]
  listOfGrades: IGrade[]
  listOfGradesByStageId: IGrade[]
  pagination = {
    pageSize: 20,
    pageNo: 1,
  }

  constructor(
    private _SubjectService: SubjectService,
    private _SweetAlertService: SweetAlertService,
    public _NgbActiveModal: NgbActiveModal,
    private _CountryService: CountryService,
    private _SectionService: SectionService,
  ) {}

  ngOnInit(): void {
    document.title = `${environment.webSiteName} | المواد`;
    this.createNewSubjectForm()

  }

  createNewSubjectForm() {
    this.subjectForm = new FormGroup({
      sectionId: new FormControl(null, Validators.required),
      gradeId: new FormControl(null, Validators.required),
      stageId: new FormControl(null, Validators.required),
      subjectName: new FormControl('', Validators.required),
      subjectImage: new FormControl(null),
      index: new FormControl(0),
    })
  }



  uploadFile(files: any) {
    this.subjectImage = files[0];
    this.subjectForm.get('subjectImage').setValue(files[0])
  }

  previewFile() {
    window.open(window.URL.createObjectURL(this.subjectImage))
  }

  resetGradeId() {
    this.subjectForm.get('gradeId').reset()
  }

  filterStagesAndGradesByCountry(country: ICountryModel) {

    if (!country.id || !country.id.length) {
      this.listOfStages = []
      this.listOfSections = []
      return
    }
    this._SubjectService.getAllStages(country.id).subscribe((res) => {
      let result: any = res;
      this.listOfStages = result
    });
    this._SectionService
      .getAllSections(country.id)
      .subscribe((res) => (this.listOfSections = res))
  }

  // Get Grades By Stage Id
  getGradesByStageId(stageId: IStage) {
    if(stageId){
      // this.editSubjectForm.get('gradeId').reset()
      this._SubjectService.getGradesByStageId(stageId.stageId).subscribe((res) => {
        let result: any = res;
        this.listOfGradesByStageId = result;
        this.listOfGrades = result;
      })
    }
  }

  collectDataCreateSubject() {
    let fd = new FormData();
    fd.append('SectionId', this.subjectForm.get('sectionId').value);
    fd.append('GradeId', this.subjectForm.get('gradeId').value);
    fd.append('SubjectName', this.subjectForm.get('subjectName').value);
    fd.append('SubjectImage', this.subjectForm.get('subjectImage').value);
    fd.append('Index', this.subjectForm.get('index').value);
    return fd;
  }
  // Create Subject
  createSubject() {
    this._SubjectService.createSubject(this.collectDataCreateSubject()).subscribe({
      next: (res) => {
        this._SweetAlertService.createSuccess()
      },
      error: (err) => {
        this._SweetAlertService.errorMessage(err)
      }
    }
    );
  }




}
