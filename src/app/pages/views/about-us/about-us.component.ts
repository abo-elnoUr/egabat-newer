import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AboutUsService } from './about-us.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  aboutUsForm: FormGroup;

  constructor(private _aboutUsService: AboutUsService,private _formBuilder: FormBuilder) {

    this.aboutUsForm = this._formBuilder.group({
      aboutUs: '',
      provide: '',
      terms: '',
      egabat: '',
      contact: '',
    });
  }

  ngOnInit(): void {
    this.getAboutUs();
  }

  getAboutUs() {
    this._aboutUsService.GetAboutUs().subscribe((response: any) => {
      this.aboutUsForm.patchValue({
        aboutUs: response.aboutUs,
        provide: response.provide,
        terms: response.terms,
        egabat: response.egabat,
        contact: response.contact,
      })
    })
  }
  isSubmiting: boolean = false;
  submit() {
    this.isSubmiting = true;
    this._aboutUsService.EditAboutUs(this.aboutUsForm.value).subscribe(response => {
      this.aboutUsForm.disable();
      Swal.mixin({
        toast: true,
        position: "center",
        icon: "success",
        timer: 2500,
        showCancelButton: false,
        showConfirmButton: false,
        text: "تم حفظ البيانات بنجاح",
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire();
      this.isSubmiting = false;
      this.aboutUsForm.enable();

    })
  }



}
