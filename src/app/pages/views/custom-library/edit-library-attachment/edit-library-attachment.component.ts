import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { CreateSubCategoryAttachmentDto, SubCategoryAttachmentResponse, SubCategoryResponse } from 'src/app/helpers/_interfaces/custom-library';
import { CustomLibraryService } from '../service/custom-library.service';

@Component({
  selector: 'app-edit-library-attachment',
  templateUrl: './edit-library-attachment.component.html',
  styleUrls: ['./edit-library-attachment.component.scss']
})
export class EditLibraryAttachmentComponent implements OnInit {

  editAttachmentForm: FormGroup
  subCategoryId: string = ''
  categoryId: string = ''
  imgUrl = 'https://localhost:7034/'
  currentImage = ''
  addNewImage: string = ''


  constructor(
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _CustomLibraryService: CustomLibraryService,
    private _SweetAlertService: SweetAlertService,
    private _Router: Router
  ) {
    this._ActivatedRoute.params.subscribe(params => {
      this.subCategoryId = params['attachmentId']
      this.categoryId = params['categoryId']
    })
  }

  ngOnInit(): void {
    document.title = 'ملفات المكتبات'
    this.createEditAttachmentForm()

    // call functions
    this.getLibraryAttachmentById()
  }

  createEditAttachmentForm() {
    this.editAttachmentForm = this._FormBuilder.group({
      subCategoryId: [this.subCategoryId],
      name: [''],
      subCategoryImage: [null],
      categoryId: [this.categoryId],
      createSubCategoryAttachmentDtos: this._FormBuilder.array([])
    })
  }



  getLibraryAttachmentById() {
    this._CustomLibraryService.GetSubCategoryBySubCategoryId(this.subCategoryId).subscribe({
      next: (response) => {
        this.patchDataToForm(response)
      }
    })
  }

  get Files(): FormArray {
    return this.editAttachmentForm.get("createSubCategoryAttachmentDtos") as FormArray
  }

  editLibraryAttachment(file: SubCategoryAttachmentResponse): FormGroup {
    return this._FormBuilder.group({
      title: [file.title, [Validators.required]],
      file: [file.file, [Validators.required]],
      fileImage: [file.file_Image, [Validators.required]]
    }) as FormGroup
  }

  addNewLibraryAttachment() {
    return this.Files.push(
      this._FormBuilder.group({
        title: ['', [Validators.required]],
        file: [null, [Validators.required]],
        fileImage: [null, [Validators.required]]
      }))
  }

  addLibraryFile(file: SubCategoryAttachmentResponse) {
    this.Files.push(this.editLibraryAttachment(file))
  }

  patchDataToForm(data: SubCategoryResponse) {
    this.editAttachmentForm.patchValue({
      name: data.subCategory_Name
    })

    this.currentImage = data.subCategory_Image

    data.subCategoryAttachmentResponse.map(file => {
      this.addLibraryFile(file)
    })
  }

  editLibraraySubCategoryImage(image: any) {
    this.addNewImage = image
    this.editAttachmentForm.get('subCategoryImage')?.setValue(image)
  }

  uploadImage(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let image = event.target.files[0]
    fileItem.get("fileImage")?.setValue(image)
  }

  uploadPdf(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let pdf = event.target.files[0]
    fileItem.get("file")?.setValue(pdf)
  }

  removeLibraryFile(index: number) {
    this.Files.removeAt(index)
  }



  editAttachmentFormData() {
    const attachment = new FormData()
    attachment.append('subCategoryId', this.subCategoryId)
    attachment.append('name', this.editAttachmentForm.get('name')?.value)

    if (this.addNewImage) {
      attachment.append('subCategoryImage', this.editAttachmentForm.get('subCategoryImage')?.value)
    }
    else {
      attachment.append('subCategoryImage', this.currentImage)
    }

    attachment.append('categoryId', this.editAttachmentForm.get('categoryId')?.value)
    if (this.Files.length) {
      for (let f = 0; f < this.Files.controls.length; f++) {
        attachment.append(`createSubCategoryAttachmentDtos[${f}].title`, this.Files?.controls[f]?.get("title")?.value)
        attachment.append(`createSubCategoryAttachmentDtos[${f}].file`, this.Files?.controls[f]?.get("file")?.value)
        attachment.append(`createSubCategoryAttachmentDtos[${f}].fileImage`, this.Files?.controls[f]?.get("fileImage")?.value)
      }
    }
    return attachment
  }

  editAttachment() {
    this._CustomLibraryService.editSubCategory(this.editAttachmentFormData()).subscribe({
      next: (response) => {
        this._SweetAlertService.updateSuccess()
        // this._Router.navigate(['/Admin/dashboard/library-sub-category/', this.subCategoryId])
      }
    })

  }

}
