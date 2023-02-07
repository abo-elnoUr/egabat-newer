import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from '../../API/reports.service';
import { environment } from 'src/environments/environment';

const env = environment
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsComponent } from '../../reports.component';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  @Input() modal: any;
  @Input() requestId: string;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent

  env = env;

  RequestDetails: RequestDetails;

  constructor(private ReportsServices: ReportsService, private modalService: NgbModal, private reportsComponent: ReportsComponent) { }

  ngOnInit(): void {
    this.getRequestDetails(this.requestId)

  }


  getRequestDetails(requestId: string) {
    this.ReportsServices.getReportDetails(requestId).subscribe(res => {
      this.RequestDetails = res;
      console.log(res)
    })
  }


  DownloadAttachment(filePath: any) {

    console.log(filePath)

    // alert("Downloaded")

    const fullPath = `${env.API_ROOT}/${filePath}`
    console.log(fullPath)
    let FileName = fullPath.split(/\\/)[fullPath.lastIndexOf('/')];

    console.log(FileName)

    FileSaver.saveAs(fullPath, FileName);
  }


  changeImageExtention(filename: any) {
    this.ReportsServices.changeImageExtention(filename).subscribe(res => {
      console.log(res)
    })
  }

  deleteAnswerFromRequest(id: string) {
    this.ReportsServices.deleteAnswerFromRequest(id).subscribe(res => {
      this.modalService.dismissAll()
      this.successSwal.fire()
      this.reportsComponent.getRequestsReport()
    })
  }

}


export interface RequestDetails {
  "request": {
    "requestId": string,
    "requestNo": Number,
    "description": string,
    "date": string,
    "replied": Boolean,
    "subjectId": string,
    "subjectName": string,
    "studentId": string,
    "teacherId": string,
    "stageId": string,
    "stageName": string,
    "gradeId": string,
    "gradeName": string,
    "sectionName": string,
    "attachments": [
      {
        "file": Blob
      }
    ]
  },
  "answer": {
    "answerId": string,
    "description": string,
    "date": string,
    "teacherId": string,
    "studentId": string,
    "subjectId": string,
    "subjectName": string,
    "requestId": string,
    "stageId": string,
    "stageName": string,
    "gradeId": string,
    "gradeName": string,
    attachments: [
      {
        attachmentId: string,
        answerId: string,
        file: string,
        type: string
      }
    ]
  }
}
