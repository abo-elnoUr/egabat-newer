import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment as env } from 'src/environments/environment';

import { LibsCategs } from 'src/app/helpers/enums/libraries-categories.enum';
import { ILibrary } from 'src/app/helpers/_interfaces/library';
import Swal from 'sweetalert2';
import { LibrariesService } from './libraries.service';
import { GradesService } from '../grades/API/grades.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomLibraryService } from '../custom-library/service/custom-library.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { MainCategoryResponse } from 'src/app/helpers/_interfaces/custom-library';

const environment = env;

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss'],
})
export class LibrariesComponent implements OnInit {

  SITE_URL = `${environment.API_ROOT}/`;
  // listOfLibraries: ILibrary[] = [];
  listOfLibraries: MainCategoryResponse[] = [];
  gradeId: string = '';
  libraryId: string = '';

  filter = {
    stageId: '',
    gradeId: '',
    countryId: '',
    // semsterId: ''
  };
  mainCategoryId: string;
  editLibraryForm: FormGroup<{
      mainCategoryId: FormControl<string>
      name: FormControl<string>,
      stageId: FormControl<string>,
      gradeId: FormControl<string>,
      semsterId: FormControl<string>,
      countryId: FormControl<string>,
      image: FormControl<any>
  }>;
  closeResult: string;
  imgUrl = `${environment.API_ROOT}/`
  get LibsCategs(): typeof LibsCategs {
    return LibsCategs;
  }

  constructor(
    private modalService: NgbModal,
    private _libraryService: LibrariesService,
    private _activedRoute: ActivatedRoute,
    private _GradesService: GradesService,
    private _fb: FormBuilder,
    private _SweetAlertService: SweetAlertService,
    private _customLibraryService: CustomLibraryService
  ) {
    this.gradeId = this._activedRoute.snapshot.params['gradeId'];
  }

  ngOnInit(): void {
    // this.getLibraries();
    this.getGradeById(this.gradeId);
    this.createEditLibraryForm();
  }

   createEditLibraryForm() {
    this.editLibraryForm = this._fb.group({
      mainCategoryId: [this.mainCategoryId],
      name: [''],
      stageId: [null],
      gradeId: [null],
      semsterId: [null],
      countryId: [null],
      image: ['']
    })
  }
  // getLibraries() {
  //   this._libraryService.getLibrariesForAdmin(this.gradeId).subscribe(response => {
  //     response.forEach(res => { res.file = `${environment.API_ROOT}/${res.file}` })
  //     this.listOfLibraries = response;
  //   })
  // }

  getGradeById(gradeId: string) {
    this._GradesService.getGeadeByID(gradeId).subscribe({
      next: (res) => {
        // console.log(res);
        this.filter.stageId = res.stageId;
        this.filter.gradeId = res.gradeId;
        this.filter.countryId = res.countryId;
        // this.filter.semsterId = ''
        this.editLibraryForm.patchValue({
          countryId: res.countryId,
          gradeId: res.gradeId,
          stageId: res.stageId
        })
        this.getLibrarys();
      },
    });
  }

  getLibrarys() {
    this._libraryService.getLibrarys(this.filter).subscribe({
      next: (res) => {
        // console.log(res);
        this.listOfLibraries = res;
      },
    });
  }

  image: string
  editlibraryImage(image: any) {
    this.image = image
    this.editLibraryForm.controls.image.setValue(image);
  }

  currentImage: string = '';
  getLibraryById(libraryId: string) {
    this._customLibraryService.getLibraryById(libraryId).subscribe({
      next: (response) => {
        // console.log(response);
        // this.editLibraryForm.patchValue(response)
        this.editLibraryForm.patchValue({
          name: response.mainCategory_Name,
          stageId: response.stageId,
          gradeId: response.gradeId,
          semsterId: response.semsterId,
          countryId: response.countryId
        })
        this.currentImage = response.mainCategory_Image
        // console.log(this.editLibraryForm.value);
      }
    })
  }

  editLibraryFormData() {
    const library = new FormData()
    library.append('mainCategoryId', this.mainCategoryId)
    library.append('name', this.editLibraryForm.controls.name.value);

    if (this.image) {
      library.append('image', this.image);
    }
    else {
      library.append('image', this.currentImage);
    }
    library.append('stageId', this.editLibraryForm.controls.stageId.value);
    library.append('gradeId', this.editLibraryForm.controls.gradeId.value);
    library.append('semsterId', this.editLibraryForm.controls.semsterId.value);
    library.append('countryId', this.editLibraryForm.controls.countryId.value);
    return library
  }

  editLibrary() {
    this._customLibraryService.editLibrary(this.editLibraryFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
        this.editLibraryForm.reset()
        this.getLibrarys()
      }
    })
  }

  toggleLibraryActive(id: string, isActive: boolean) {
    this._customLibraryService.toggleLibraryActive(id).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
      }
    })
  }
  deleteLibrary(libraryId: string) {
    this._customLibraryService.deleteLibrary(libraryId).subscribe({
      next: (response) => {
        this._SweetAlertService.deleteSuccess()
        this.getLibrarys()
      }
    })
  }
  openEditLibrry(content: any, id: string) {
    this.mainCategoryId = id
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    this.createEditLibraryForm();
    // console.log('close')
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
