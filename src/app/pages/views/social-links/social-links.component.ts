import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { SocialLinksService } from './social-links.service';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {

  socialLinksForm: FormGroup;

  constructor(
    private _socialLinks: SocialLinksService,
    private _formBuilder: FormBuilder
  ) {
    this.socialLinksForm = this._formBuilder.group({
      "facebook": "",
      "twitter": "",
      "youtube": "",
      "linkedin": "",
      "instagram": "",
      "whatsApp": "",
    })
  }

  ngOnInit(): void {
    this.getSocialLinks();
  }

  getSocialLinks() {
    this._socialLinks.getSocialLinks().subscribe((response: any) => {
      this.socialLinksForm.patchValue({
        facebook: response.facebook,
        twitter: response.twitter,
        linkedin: response.linkedin,
        instagram: response.instagram,
        youtube: response.youtube,
        whatsApp: response.whatsApp
      })
    })
  }
  isSubmiting: boolean = false;
  submit() {
    this.isSubmiting = true;
    this._socialLinks.editSocialLinks(this.socialLinksForm.value).subscribe(response => {
      this.socialLinksForm.disable();
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
      this.socialLinksForm.enable();

    })
  }



}
