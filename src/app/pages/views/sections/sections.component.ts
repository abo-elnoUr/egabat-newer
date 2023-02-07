import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ISection } from 'src/app/models/sections.model';
import Swal from 'sweetalert2';
import { ICountryModel } from '../../../models/country.model';
import { CountryService } from '../../../shared/country.service';
import { SectionService } from "./api/section.service";
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent implements OnInit {

  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @ViewChild('ErrorSwal') private errorSwal: SwalComponent;

  countries: Array<ICountryModel> = [];
  closeResult = '';
  errorMessage: string
  listOfSections: ISection[]
  editingSectionId: string = ""
  editSectionName: string = ""
  editSectionIndex: number = 0
  editSectionCountry: string = '';
  deleteSectionId: string = ""

  countryId: string = "";
  constructor(private _sectionService: SectionService,
    private modalService: NgbModal,
    private countryService: CountryService) {

  }
  getAllCountries() {
    this.countryService.getAllCountries().subscribe(res => this.countries = res);
  }
  ngOnInit(): void {
    this.getAllCountries();
    this.getAllSections()
  }

  getCountrySections(id: string) {
    this.countryId = id;
    this.getAllSections();
  }
  getAllSections() {


    this._sectionService.getAllSections(this.countryId).subscribe(res => {
      this.listOfSections = res
    })
  }
  openEdit(content: any, sectionId: string, name: string, index: number, countryId: string) {
    this.editingSectionId = sectionId
    this.editSectionName = name
    this.editSectionIndex = index
    this.editSectionCountry = countryId
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }


  openAddModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }



  delteteSection() {

    this._sectionService.deleteSection(this.deleteSectionId).subscribe(
      res => {
        console.log(res)
        this.getAllSections()
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message)


        this.errorMessage = err.error.message;
        setTimeout(() => {
          this.errorSwal.fire()

        }, 20)

      }
    )

    // this.HttpMethods.deleteStage(this.deleteStageId).subscribe(res => {
    //   this.successSwal.fire()
    //   this.getAllStages()
    // })
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

  toggleSectionActivation(sectionId: string) {
    this._sectionService.activation(sectionId).subscribe((response: any) => {

      Swal.fire(
        `عملية ناجحة`,
        ` تم ${response.statusFlag ? '' : 'الغاء'} التفعيل بنجاح `,
        `success`
      )

      // if (response.statusFlag) {
      //   Swal.fire(
      //     'عملية ناجحة',
      //     `تم التفعيل  بنجاح` ,
      //     'success'
      //   )
      // } else {
      //   Swal.fire(
      //     'عملية ناجحة',
      //     `تم الغاء التفعيل  بنجاح` ,
      //     'success'
      //   )
      // }
    })
  }

}
