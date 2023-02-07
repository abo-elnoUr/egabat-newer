import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IReport } from 'src/app/helpers/_interfaces/Reports';
import { ReportsService } from './API/reports.service';
import { environment } from 'src/environments/environment';

const env = environment
import { FormBuilder, FormGroup } from '@angular/forms';
import { SectionService } from '../sections/api/section.service';
import { StageHttpService } from '../stages/API/stages-http.service';
import { GradesService } from '../grades/API/grades.service';
import { SubjectService } from '../subjects/Api/api-http.service';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
// import { saveAs } from 'file-saver';
// Download

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  requestsReport: IReport = {
    rowCount: 0,
    requestsReport: []
  };
  filterStatus: Boolean = false;
  closeResult = ''
  viewRequestId: string = "";
  reportFilterForm: FormGroup;
  paginationModel = {
    pageSize: 20,
    pageNo: 1
  }

  constructor(
    private HttpMethods: ReportsService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,

    private _sectionService: SectionService,
    private _stageService: StageHttpService,
    private _gradeService: GradesService,
    private _subjectService: SubjectService

  ) {
    this.reportFilterForm = this._formBuilder.group({
      "sectionId": [null],
      "stageId": [null],
      "gradeId": [null],
      "subjectId": [null],
      "requestNo": 0,
      "studentName": [''],
      "teacherName": [''],
      "dateFrom": [''],
      "dateTo": [''],
    })
  }


  listOfSections: ISection[]
  getSections() {
    this._sectionService.getAllSections().subscribe(response => this.listOfSections = response);
  }
  listOfStages: IStage[];
  getStages() {
    this._stageService.getAllStages().subscribe(response => this.listOfStages = response);
  }

  listOfGrades: IGrade[]
  getGrades() {
    const stageId: string = this.reportFilterForm.get("stageId")?.value;
    if (!stageId) {
      this.reportFilterForm.patchValue({
        gradeId: null
      })
      return;
    };
    this._gradeService.getGradesByStageId(stageId).subscribe(response => this.listOfGrades = response);
  }


  listOfSubjects: ISubject[];
  getSubjects() {
    let sectionId: string = this.reportFilterForm.get("sectionId")?.value;
    let gradeId: string = this.reportFilterForm.get("gradeId")?.value;

    if (!sectionId || !gradeId) return;

    this._subjectService.getSubjectBySectionAndGrade(sectionId, gradeId).subscribe(response => {
      console.log("subjects", response)
      this.listOfSubjects = response
    });
  }



  ngOnInit(): void {
    this.getSections();
    this.getStages();
    this.getRequestsReport();
  }

  getRequestsReport() {
    this.HttpMethods.getAllRequestsReport().subscribe(res => {
      this.requestsReport = res;
    });
  }
  filterReports() {
    this.HttpMethods.getReportsWithFilter({ ...this.reportFilterForm.value, ...this.paginationModel }).subscribe(response => {
      this.requestsReport = response;
    })
  }


  submit() {
    this.filterReports();
  }


  openDetailsModal(content: any, requestId: string) {
    this.viewRequestId = requestId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: "xl" }).result.then((result) => {
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
}