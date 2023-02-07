import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ITeacherProfile, IUpdateTeacherData } from 'src/app/helpers/_interfaces/teacher';
import { TeachersApiService } from '../../API/teachers-api.service';
import { TeachersComponent } from '../../teachers.component';

@Component({
  selector: 'app-edit-teacher-profile',
  templateUrl: './edit-teacher-profile.component.html',
  styleUrls: ['./edit-teacher-profile.component.scss']
})
export class EditTeacherProfileComponent implements OnInit {
  @Input() modal: any;

  @Input() teacherId: string;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @ViewChild('NoChangeOnDataSwal') private warningSwal: SwalComponent;
  @ViewChild('AllFiledsRequired') private warningSwal2: SwalComponent;

  teacherProfileData: ITeacherProfile = {
    name: "",
    mobile: "",
    email: "",

  };
  upDateTeacherData: IUpdateTeacherData = {
    teacherId: "",
    name: "",
    email: "",
    mobile: ""
  };
  constructor(private HttpMethods: TeachersApiService, private modalService: NgbModal, private mainTecherMethods: TeachersComponent) { }



  ngOnInit(): void {
    this.getTeacherData()
  }


  getTeacherData() {
    this.HttpMethods.getTeacherById(this.teacherId).subscribe(res => {
      this.teacherProfileData = {
        email: res.email,
        name: res.name,
        mobile: res.mobile
      }
      this.upDateTeacherData = {
        email: res.email,
        name: res.name,
        mobile: res.mobile,
        teacherId: res.teacherId
      }
    })
  }

  editTeacherProfile() {

    // alert("Up Data Is Started ")

    let PrevData = this.teacherProfileData;
    let NewData = this.upDateTeacherData;

    console.log("PrevData", PrevData)
    console.log("NewData", NewData)

    if (NewData.name !== PrevData.name || NewData.email !== PrevData.email || NewData.mobile !== PrevData.mobile) {

      if (!NewData.name || !NewData.email || !NewData.mobile) {
        this.warningSwal2.fire()
      } else {
        this.HttpMethods.editTeacherProfile(this.upDateTeacherData).subscribe(res => {
          this.modalService.dismissAll()
          this.successSwal.fire()
          this.mainTecherMethods.getTeachers()

        })
      }

    } else {

      this.warningSwal.fire()
    }

  }

}
