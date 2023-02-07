import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../roles.service';

@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss']
})
export class EditUserRoleComponent implements OnInit {

  editUserProfileForm: FormGroup;

  constructor(
    private _user_roles_service: RolesService,
    private _form_builder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.editUserProfileForm = this._form_builder.group({
      "adminId": "",
      "adminName": "",
      "sectionId": "",
      "email": ""
    })
  }
  userId: string = "";
  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId') || '';
    this.getAllSections();
    this.getAdminData();

  }



  /*   
    "id": "b2c56b86-39b5-4bcb-b775-9bc5b208f8d0",
    "userName": "MOHAMED ZIAD",
    "sectionId": "3e60f593-0cae-49cf-be64-7423b2be47cf",
    "sectionName": "Bublic",
    "email": "moziad@gmail.com"
   */
  getAdminData() {
    this._user_roles_service.getAdminData(this.userId).subscribe((response: any) => {
      let form = this.editUserProfileForm;
      form.get("adminId")?.setValue(response.id);
      form.get("adminName")?.setValue(response.userName);
      form.get("sectionId")?.setValue(response.sectionId);
      form.get("email")?.setValue(response.email);
    })
  };

  listOfSections: any = []
  getAllSections() {
    this._user_roles_service.getAllSections().subscribe((response) => {
      this.listOfSections = response;
      console.log(response);
    })
  }

  status: boolean = false;
  submit() {
    this.status = true;
    this._user_roles_service.editAdminProfile(this.editUserProfileForm.value).subscribe(response => {
      console.log(response);
      this.status = false;
      this._router.navigate(["/Admin/dashboard/roles"])
    })
  }


}
