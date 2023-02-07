import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IStudent } from 'src/app/helpers/_interfaces/student';
import { ISubject, ISubjectFilterResponse } from 'src/app/helpers/_interfaces/subject';
import { StudentAPIService } from '../../API/student-api.service';

@Component({
  selector: 'app-edit-extra-requests',
  templateUrl: './edit-extra-requests.component.html',
  styleUrls: ['./edit-extra-requests.component.scss']
})
export class EditExtraRequestsComponent implements OnInit {

  @Input() modal: any;
  @Input() StudentId: string;
  @ViewChild('SuccessSwal') private success: SwalComponent;

  studentData: IStudent;
  studentSubjects: ISubjectFilterResponse = {
    rowCount: 0,
    subjects: []
  }

  @Input() sectionId: string;

  subjectId: string = "";
  requestsCount: number = 0;



  constructor(private HttpMethods: StudentAPIService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.HttpMethods.getStudentById(this.StudentId).subscribe(res => {
      this.studentData = res
      this.HttpMethods.getStudentSubjectsByGradeId({ gradeId: res.gradeId, sectionId: this.sectionId }).subscribe(res => {
        console.log('getStudentSubjectsByGradeId', res)
        this.studentSubjects = res
      })
    })
  }

  getExtraRequsetData() {
    this.HttpMethods.getStudentExtraRequestesForSubject({ studentId: this.StudentId, subjectId: this.subjectId }).subscribe(response => {
      this.requestsCount = response.requestCount
    })
  }

  addExtraRequest() {
    this.HttpMethods.addExtraRequest({
      "studentId": this.StudentId,
      "subjectId": this.subjectId,
      "requestCount": parseInt(`${this.requestsCount}`)
    }).subscribe(res => {
      this.success.fire()
      this.modalService.dismissAll()
    })
  }
}





