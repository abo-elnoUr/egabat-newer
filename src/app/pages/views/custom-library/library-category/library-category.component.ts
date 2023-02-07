import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomLibraryService } from '../service/custom-library.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { CategoryPublicResponse, CategoryResponse } from 'src/app/helpers/_interfaces/custom-library';


@Component({
  selector: 'app-library-category',
  templateUrl: './library-category.component.html',
  styleUrls: ['./library-category.component.scss']
})
export class LibraryCategoryComponent implements OnInit {

  listOfLibraryCategorys: CategoryPublicResponse
  listOfCategories: CategoryResponse[] = []
  libraryCategoryForm: FormGroup
  editLibraryCategoryForm: FormGroup
  libraryCategoryId: string = ''
  libraryId: string = ''
  imgUrl = 'https://localhost:7034/'
  currentImage: string = ''
  pagination = {
    pageSize: 10,
    pageNo: 1
  }

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _CustomLibraryService: CustomLibraryService,
    private _SweetAlertService: SweetAlertService
  ) {
    this._ActivatedRoute.params.subscribe(params => {
      this.libraryId = params['libraryId']
    })
  }

  ngOnInit(): void {
    document.title = 'اقسام المكتبات الرئيسيه'
    this.createLibraryCategoryForm()
    this.createEditLibraryCategoryForm()

    // this.getAllLibraryCategory()
    this.getLibraryCategorysByLibraryId()
  }

  openLibraryCategory(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openEditLibrary(content: any, id: string) {
    this.libraryCategoryId = id
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

  createLibraryCategoryForm() {
    this.libraryCategoryForm = this._FormBuilder.group({
      name: [''],
      mainCategoryId: [this.libraryId],
      image: [null]
    })
  }

  createEditLibraryCategoryForm() {
    this.editLibraryCategoryForm = this._FormBuilder.group({
      name: [''],
      mainCategoryId: [this.libraryId],
      categoryId: [this.libraryCategoryId],
      image: [null]
    })
  }

  // getAllLibraryCategory(){
  //   const filter = {...this.pagination}
  //   this._CustomLibraryService.getLibraryCategorys(filter).subscribe({
  //     next: (response) => {
  //       this.listOfLibraryCategorys = response
  //     }
  //   })
  // }

  getLibraryCategorysByLibraryId() {
    this._CustomLibraryService.getLibraryCategorysByLibraryId(this.libraryId).subscribe({
      next: (response) => {
        this.listOfCategories = response
      }
    })
  }

  getLibrarayCategoryImage(image: any) {
    this.libraryCategoryForm.get('image')?.setValue(image)
  }

  image: string
  editLibrarayCategoryImage(image: any) {
    this.image = image
    this.editLibraryCategoryForm.get('image')?.setValue(image)
  }

  getLibraryCategoryById(id: string) {
    this._CustomLibraryService.getLibraryCategoryById(id).subscribe({
      next: (response) => {
        this.editLibraryCategoryForm.patchValue({
          name: response.category_Name
        })
        this.currentImage = response.category_Image
      }
    })
  }

  addLibraryCategoryFormData() {
    const libraryCategory = new FormData()
    libraryCategory.append('mainCategoryId', this.libraryCategoryForm.get('mainCategoryId')?.value)
    libraryCategory.append('name', this.libraryCategoryForm.get('name')?.value)
    libraryCategory.append('image', this.libraryCategoryForm.get('image')?.value)
    return libraryCategory
  }

  addLibraryCategory() {
    this._CustomLibraryService.addLibraryCategory(this.addLibraryCategoryFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.createSuccess()
        this.libraryCategoryForm.reset()
        this.getLibraryCategorysByLibraryId()
      }
    })
  }

  editLibraryCategoryFormData() {
    const libraryCategory = new FormData()
    libraryCategory.append('categoryId', this.libraryCategoryId)
    libraryCategory.append('mainCategoryId', this.editLibraryCategoryForm.get('mainCategoryId')?.value)
    libraryCategory.append('name', this.editLibraryCategoryForm.get('name')?.value)
    if (this.image) {
      libraryCategory.append('image', this.editLibraryCategoryForm.get('image')?.value)
    }
    else {
      libraryCategory.append('image', this.currentImage)
    }
    return libraryCategory
  }

  editLibraryCategory() {

    this._CustomLibraryService.editLibraryCategory(this.editLibraryCategoryFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
        this.getLibraryCategorysByLibraryId()
      }
    })
  }

  deleteCategoryLibrary(id: string) {
    this._CustomLibraryService.deleteLibraryCategory(id).subscribe({
      next: (response) => {
        this._SweetAlertService.deleteSuccess()
        this.getLibraryCategorysByLibraryId()
      }
    })
  }

  toggleLibraryCategoryActive(id: string, isActive: boolean) {
    this._CustomLibraryService.toggleLibraryCategoryActive(id).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
      }
    })
  }

}
