import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { StageHttpService } from '../stages/API/stages-http.service';
import { GradesService } from '../grades/API/grades.service';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { SemesterService } from '../semesters/service/semester.service';
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import { CustomLibraryService } from './service/custom-library.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { MainCategoryPublicResponse } from 'src/app/helpers/_interfaces/custom-library';

@Component({
  selector: 'app-custom-library',
  templateUrl: './custom-library.component.html',
  styleUrls: ['./custom-library.component.scss']
})
export class CustomLibraryComponent implements OnInit {



  listOfLibrarys: MainCategoryPublicResponse
  closeResult = '';
  libraryForm: FormGroup
  editLibraryForm: FormGroup
  listOfStages: IStage[] = []
  listOfGrades: IGrade[] = []
  listOfSemester: ISemester[] = []
  mainCategoryId: string = ''
  imgUrl = 'https://localhost:7034/'
  currentImage: string = ''
  general: boolean = true

  pagination = {
    pageSize: 10,
    pageNo: 1
  }

  constructor(
    private modalService: NgbModal,
    private _FormBuilder: FormBuilder,
    private _StageHttpService: StageHttpService,
    private _GradesService: GradesService,
    private _SemesterService: SemesterService,
    private _CustomLibraryService: CustomLibraryService,
    private _SweetAlertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    document.title = 'المكتبات'
    this.createAddLibraryForm()
    this.createEditLibraryForm()

    // call functions
    this.getStages()
    this.getLibrarys()
    this.getSemesters()

  }

  createAddLibraryForm() {
    this.libraryForm = this._FormBuilder.group({
      name: [''],
      stageId: [null],
      gradeId: [null],
      semsterId: [null],
      image: ['']
    })
  }

  createEditLibraryForm() {
    this.editLibraryForm = this._FormBuilder.group({
      mainCategoryId: [this.mainCategoryId],
      name: [''],
      stageId: [null],
      gradeId: [null],
      semsterId: [null],
      image: ['']
    })
  }

  openAddLibrary(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getLibraryImage(image: any) {
    this.libraryForm.get('image')?.setValue(image)
  }

  getStages() {
    this._StageHttpService.getAllStages('').subscribe({
      next: (response) => {
        this.listOfStages = response
      }
    })
  }

  getGrades(stageId: string) {
    this._GradesService.getGradesByStageId(stageId).subscribe({
      next: (response) => {
        this.listOfGrades = response
      }
    })
  }


  getGradesOfStage() {
    let stageId = this.libraryForm.get('stageId')?.value
    if (stageId) {
      this.getGrades(stageId)
    }
  }

  getGradesOfStageOnEdit() {
    let stageId = this.editLibraryForm.get('stageId')?.value
    if (stageId) {
      this.getGrades(stageId)
    }
  }

  getSemesters() {
    this._SemesterService.getSemesters('').subscribe({
      next: (response) => {
        this.listOfSemester = response
      }
    })
  }

  addLibraryFormData() {
    const library = new FormData()
    library.append('name', this.libraryForm.get('name')?.value)
    library.append('image', this.libraryForm.get('image')?.value)
    if (!this.general) {
      library.append('stageId', '')
      library.append('gradeId', '')
      library.append('semsterId', '')
    }
    else {
      library.append('stageId', this.libraryForm.get('stageId')?.value)
      library.append('gradeId', this.libraryForm.get('gradeId')?.value)
      library.append('semsterId', this.libraryForm.get('semsterId')?.value)
    }

    return library
  }

  addLibrary() {
    this._CustomLibraryService.addLibrary(this.addLibraryFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.createSuccess()
        this.libraryForm.reset()
        this.getLibrarys()
      }
    })
  }

  getLibrarys() {
    const filter = { ...this.pagination }
    this._CustomLibraryService.getLibrarys(filter).subscribe({
      next: (response) => {
        this.listOfLibrarys = response
      }
    })
  }


  getLibraryById(libraryId: string) {
    this._CustomLibraryService.getLibraryById(libraryId).subscribe({
      next: (response) => {
        this.editLibraryForm.patchValue(response)
        this.editLibraryForm.patchValue({
          name: response.mainCategory_Name,
          stageId: response.stageId,
          gradeId: response.gradeId,
          semsterId: response.semsterId,
        })
        if (response.general == false) {
          this.getGrades(response.stageId || '')
        }
        this.general = response.general
        this.currentImage = response.mainCategory_Image
      }
    })
  }

  image: string
  editlibraryImage(image: any) {
    this.image = image
    this.editLibraryForm.get('image')?.setValue(image)
  }

  editLibraryFormData() {
    const library = new FormData()
    library.append('mainCategoryId', this.mainCategoryId)
    library.append('name', this.editLibraryForm.get('name')?.value)

    if (this.image) {
      library.append('image', this.image)
    }
    else {
      library.append('image', this.currentImage)
    }
    if (this.general) {
      library.append('stageId', '')
      library.append('gradeId', '')
      library.append('semsterId', '')
    }
    else {
      library.append('stageId', this.editLibraryForm.get('stageId')?.value)
      library.append('gradeId', this.editLibraryForm.get('gradeId')?.value)
      library.append('semsterId', this.editLibraryForm.get('semsterId')?.value)
    }
    return library
  }

  editLibrary() {
    this._CustomLibraryService.editLibrary(this.editLibraryFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
        this.editLibraryForm.reset()
        this.getLibrarys()
      }
    })
  }

  deleteLibrary(libraryId: string) {
    this._CustomLibraryService.deleteLibrary(libraryId).subscribe({
      next: (response) => {
        this._SweetAlertService.deleteSuccess()
        this.getLibrarys()
      }
    })
  }


  toggleLibraryActive(id: string, isActive: boolean) {
    this._CustomLibraryService.toggleLibraryActive(id).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
      }
    })
  }

}


