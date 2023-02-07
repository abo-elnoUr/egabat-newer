import { Component, OnInit, ViewChild } from '@angular/core'
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2'
import { GradesService } from './API/grades.service'

import { environment as env } from "../../../../environments/environment"
import { IStage } from 'src/app/helpers/_interfaces/stage'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IGradesGetAll } from 'src/app/models/grades.model'
import Swal from 'sweetalert2'
import { ICountryModel } from '../../../models/country.model'
import { CountryService } from '../../../shared/country.service'
import { RolesEnum } from '../../../helpers/enums/roles-enum'

interface IGrade {
  gradeId: string
  gradeName: string
  index: Number
  stageId: string
  stageName: string,
  countryName: string
}

interface IEditGrade {
  gradeId: string
  gradeName: string
  index: Number
  stageId: string
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit {

  RolesEnum = RolesEnum;
  defaultSelectedValue: string = "default"
  countries: Array<ICountryModel> = [];

  listOfGrades: IGradesGetAll = {
    rowCount: 0,
    grades: []
  }

  pagination = {
    pageNo: 1,
    pageSize: 20
  }

  listOfStages: Array<IStage> = []

  gradeId: string;

  closeResult = ''

  deleteGradeID = ""

  stageIdFilterign: string = ""

  newGradeData = {
    "stageId": "",
    "gradeName": "",
    "index": 0
  }

  editGradeSnapShotData: IGrade = {
    "gradeId": "",
    "gradeName": "",
    "index": 0,
    "stageId": "",
    "stageName": "",
    "countryName": "",
  }
  upDateGrade: IEditGrade = {
    "gradeId": "",
    "gradeName": "",
    "index": 0,
    "stageId": "",
  }

  gradesFilter: FormGroup;

  constructor(
    private HttpMethods: GradesService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private countryService: CountryService
  ) {

    this.gradesFilter = this._formBuilder.group({
      "pageSize": 10,
      "pageNo": 1,
      "stageId": [null],
      "isActive": null,
      "name": "",
      "countryId": null
      // "mobile": "",
      // "sectionId": [null],
      // "gradeId": [null],
      // "subjectId": [null],
    })

  }

  set ChangeStatusFilter(status: boolean) {
    this.gradesFilter.get("isActive")?.setValue(status)
  }

  @ViewChild('SuccessSwal') private successSwal: SwalComponent

  ngOnInit(): void {

    document.title = `${env.webSiteName} | الصفوف`

    this.getAllCountries();
    this.getAllGrades()
    this.HttpMethods.getAllStages().subscribe(res => {
      this.listOfStages = res
    })


  }

  getStagesByCountryId(id: string) {
    this.HttpMethods.getAllStages(id).subscribe(res => {
      this.listOfStages = res
    })

  }
  getAllCountries() {
    this.countryService.getAllCountries().subscribe(res => this.countries = res);
  }
  getAllGrades() {
    this.HttpMethods.getAllGrades({ ...this.gradesFilter.value, ...this.pagination }).subscribe(res => {
      this.listOfGrades = res
    })
  }


  getGradeById(gradeId: string) {
    this.HttpMethods.getGeadeByID(gradeId).subscribe(res => {
      let result: any = res

    })
  }


  getGradesByStageId(stageId: string) {
    this.HttpMethods.getGradesByStageId(stageId).subscribe(res => {
      // this.listOfGrades.grades = res
    })
  }


  getGradesByFltering(statusID: string) {

    if (statusID === "GetAll") {
      this.getAllGrades()
      this.stageIdFilterign = ""
    } else {
      this.getGradesByStageId(statusID)
      this.stageIdFilterign = statusID
    }
  }

  createNewGrade() {
    this.HttpMethods.createGrade(this.newGradeData).subscribe(res => {
      this.modalService.dismissAll()
      this.successSwal.fire()

      if (this.stageIdFilterign) {
        this.getGradesByFltering(this.stageIdFilterign)
      } else {
        this.getAllGrades()
      }
    })
  }


  editGrade() {

    let PrevData = this.editGradeSnapShotData, NewData = this.upDateGrade

    if (NewData.stageId != PrevData.stageId || NewData.gradeName != PrevData.gradeName || NewData.index != PrevData.index) {
      this.HttpMethods.editGrade(this.upDateGrade).subscribe(res => {
        this.modalService.dismissAll()
        this.successSwal.fire()

        if (this.stageIdFilterign) {
          this.getGradesByFltering(this.stageIdFilterign)
        } else {
          this.getAllGrades()
        }
      })

    }

  }

  deleteGrade() {
    this.HttpMethods.deleteGrade(this.deleteGradeID).subscribe(res => {
      this.modalService.dismissAll()
      this.successSwal.fire()

      if (this.stageIdFilterign) {
        this.getGradesByFltering(this.stageIdFilterign)
      } else {
        this.getAllGrades()
      }

    })
  }









  open(content: any, gradeId: string) {
    this.getGradeById(gradeId)
    this.gradeId = gradeId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
      this.editGradeSnapShotData = {
        "gradeId": "",
        "gradeName": "",
        "index": 0,
        "stageId": "",
        "stageName": "",
        "countryName": ""
      }


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      this.editGradeSnapShotData = {
        "gradeId": "",
        "gradeName": "",
        "index": 0,
        "stageId": "",
        "stageName": "",
        "countryName": ""
      }
    })
  }


  openAddModal(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`

    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC'
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop'
    } else {
      return `with: ${reason}`
    }
  }


  toggleGradeActivation(gradeId: string) {
    this.HttpMethods.activation(gradeId).subscribe((response: any) => {
      Swal.fire(
        `عملية ناجحة`,
        ` تم ${response.statusFlag ? '' : 'الغاء'} التفعيل بنجاح `,
        `success`
      )
    })
  }

}
