import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

interface IUserData {
  username: string
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  // @ViewChild('ErrorToastLogin') private successSwal: SwalComponent;

  reqState: Boolean = false

  userData: IUserData = {
    username: "",
    password: ""
  };

  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private route: Router,
    private _formBuilder: FormBuilder
  ) {
    this.loginForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit(): void {
    document.title = "إجابات | تسجيل الدخول"
  }

  isShowPassword: boolean = false;
  isSubmiting: boolean = false;
  login() {
    if (this.loginForm.invalid) return;
    this.isSubmiting = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isSubmiting = false;
        if (res.token != null && !res.unauthorized) {
          this.route.navigate(['/Admin/dashboard/home'])
        }
        else {
          Swal.mixin({
            toast: true,
            position: "center",
            icon: "error",
            timer: 2500,
            showCancelButton: false,
            showConfirmButton: false,
            text: res.message,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          }).fire();
          this.isSubmiting = false;
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          timer: 2500,
          showCancelButton: true,
          cancelButtonText: 'إلغاء',
          showConfirmButton: false,
          text: 'اسم المستخدم أو كلمة السر غير صحيحة',
          timerProgressBar: true,
        }).then(() => {
          this.isSubmiting = false;
        })
      }
    });
  }

}
