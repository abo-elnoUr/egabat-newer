import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { CustomLibraryService } from '../service/custom-library.service';

@Component({
  selector: 'app-library-attachment',
  templateUrl: './library-attachment.component.html',
  styleUrls: ['./library-attachment.component.scss']
})
export class LibraryAttachmentComponent implements OnInit {

  attachmentForm: FormGroup
  subCategoryId: string = ''

  constructor(
    private _FormBuilder: FormBuilder,
    private _ActivatedRoute: ActivatedRoute,
    private _CustomLibraryService: CustomLibraryService,
    private _SweetAlertService: SweetAlertService
  ) {
    this._ActivatedRoute.params.subscribe(params => {
      this.subCategoryId = params['librarySubCategoryId']
    })
  }

  ngOnInit(): void {
    document.title = 'ملفات المكتبات'
    this.createAttachmentForm()
  }

  createAttachmentForm() {
    this.attachmentForm = this._FormBuilder.group({
      name: [''],
      subCategoryImage: [null],
      categoryId: [this.subCategoryId],
      createSubCategoryAttachmentDtos: this._FormBuilder.array([this.libraryAttachment()])
    })
  }

  libraryAttachment(): FormGroup {
    return this._FormBuilder.group({
      title: ['', [Validators.required]],
      file: [null, [Validators.required]],
      fileImage: [null, [Validators.required]]
    }) as FormGroup
  }

  get Files(): FormArray {
    return this.attachmentForm.get("createSubCategoryAttachmentDtos") as FormArray
  }

  getLibraraySubCategoryImage(image: any) {
    this.attachmentForm.get('subCategoryImage')?.setValue(image)
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

  addlLibraryAttachment() {
    this.Files.push(this.libraryAttachment())
  }

  addAttachmentForm() {
    const attachment = new FormData()
    attachment.append('name', this.attachmentForm.get('name')?.value)
    attachment.append('subCategoryImage', this.attachmentForm.get('subCategoryImage')?.value)
    attachment.append('categoryId', this.attachmentForm.get('categoryId')?.value)
    if (this.Files.length) {
      for (let f = 0; f < this.Files.controls.length; f++) {
        attachment.append(`createSubCategoryAttachmentDtos[${f}].title`, this.Files?.controls[f]?.get("title")?.value)
        attachment.append(`createSubCategoryAttachmentDtos[${f}].file`, this.Files?.controls[f]?.get("file")?.value)
        attachment.append(`createSubCategoryAttachmentDtos[${f}].fileImage`, this.Files?.controls[f]?.get("fileImage")?.value)
      }
    }
    return attachment
  }

  addAttachment() {
    this._CustomLibraryService.addLibrarySubCategory(this.addAttachmentForm()).subscribe({
      next: (response) => {
        this._SweetAlertService.createSuccess()
        location.reload()
      }
    })

  }

}
