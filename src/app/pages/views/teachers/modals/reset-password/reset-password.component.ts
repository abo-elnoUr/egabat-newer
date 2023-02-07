import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TeachersApiService } from '../../API/teachers-api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @Input() modal: any;
  @Input() teacherId: string;

  newPassword: string = "";
  requestStatus: Boolean = false;
  constructor(private HttpMethods: TeachersApiService, private modalService: NgbModal) { };

  ngOnInit(): void {
  }


  resetTeacherPasswod() {

    this.requestStatus = true;

    if (this.newPassword.length >= 6) {
      this.HttpMethods.resetTeacherPassword(this.teacherId, this.newPassword).subscribe(res => {

        this.modalService.dismissAll();
        this.successSwal.fire();
        this.requestStatus = false;

      });
    };
  };


}
