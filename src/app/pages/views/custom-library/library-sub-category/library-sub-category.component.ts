import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { SubCategoryAttachmentResponse, SubCategoryResponse } from 'src/app/helpers/_interfaces/custom-library';
import { CustomLibraryService } from '../service/custom-library.service';

@Component({
  selector: 'app-library-sub-category',
  templateUrl: './library-sub-category.component.html',
  styleUrls: ['./library-sub-category.component.scss']
})
export class LibrarySubCategoryComponent implements OnInit {

  listOfLibrarySubCategorys: SubCategoryResponse[] = []
  listOfAttachments: SubCategoryAttachmentResponse[] = []
  closeResult = ''
  libraryCategoryId: string = ''
  imgUrl = environment.API_ROOT

  constructor(
    private modalService: NgbModal,
    private _ActivatedRoute: ActivatedRoute,
    private _CustomLibraryService: CustomLibraryService,
    private _SweetAlertService: SweetAlertService
  ) {
    this._ActivatedRoute.params.subscribe(params => {
      this.libraryCategoryId = params['libraryCategoryId']
    })
  }

  ngOnInit(): void {
    document.title = 'اقسام المكتبات الفرعيه'

    this.GetSubCategoriesByCategoryId()
  }

  openAttachment(content: any, attachment: any) {
    this.listOfAttachments = attachment
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' }).result.then(
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

  previewFile(file: any) {
    window.open(window.URL.createObjectURL(file));
  }

  GetSubCategoriesByCategoryId() {
    this._CustomLibraryService.GetSubCategoriesByCategoryId(this.libraryCategoryId).subscribe({
      next: (response) => {
        this.listOfLibrarySubCategorys = response
      }
    })
  }

  deleteLibraryAttachment(id: string) {
    this._CustomLibraryService.deleteSubCategoryBySubCategoryId(id).subscribe({
      next: (response) => {
        this._SweetAlertService.deleteSuccess()
        this.GetSubCategoriesByCategoryId()
      }
    })
  }

}
