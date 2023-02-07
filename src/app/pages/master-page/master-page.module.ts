import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideBarComponent } from '../layouts/aside-bar/aside-bar.component';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import { StagesComponent } from '../views/stages/stages.component';
import { GradesComponent } from '../views/grades/grades.component';
import { SubjectsComponent } from '../views/subjects/subjects.component';
import { TeachersComponent } from '../views/teachers/teachers.component';
import { HomeComponent } from '../views/home/home.component';
import { StudentsComponent } from '../views/students/students.component';
import { CreateTeacherModalComponent } from '../views/teachers/modals/create-teacher-modal/create-teacher-modal.component';
import { EditTeacherProfileComponent } from '../views/teachers/modals/edit-teacher-profile/edit-teacher-profile.component';
import { ModifyTeacherSubjectsComponent } from '../views/teachers/modals/modify-teacher-subjects/modify-teacher-subjects.component';
import { MessagesComponent } from '../views/messages/messages.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MasterPageComponent } from '../layouts/master-page/master-page.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NewMessageComponent } from '../views/new-message/new-message.component';
import { RolesComponent } from '../views/roles/roles.component';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ResetPasswordComponent } from '../views/teachers/modals/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsComponent } from '../views/reports/reports.component';
import { CreateStageComponent } from '../views/stages/modals/create-stage/create-stage.component';
import { EditStageComponent } from '../views/stages/modals/edit-stage/edit-stage.component';
import { EditGradeComponent } from '../views/grades/modals/edit-grade/edit-grade.component';
import { CreateGradeComponent } from '../views/grades/modals/create-grade/create-grade.component';
import { ReportDetailsComponent } from '../views/reports/modals/report-details/report-details.component';
import { EditExtraRequestsComponent } from '../views/students/modals/edit-extra-requests/edit-extra-requests.component';
import { EditStudenProfile } from '../views/students/modals/edit-data/edit-data.component';
import { TeacherAmmountingComponent } from '../views/teacher-ammounting/teacher-ammounting.component';
import { SectionsComponent } from '../views/sections/sections.component';
import { EditSectionComponent } from '../views/sections/edit-section/edit-section.component';
import { AddSectionComponent } from '../views/sections/add-section/add-section.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutUsComponent } from '../views/about-us/about-us.component';


@NgModule({
  declarations: [
    AsideBarComponent,
    NavbarComponent,
    MasterPageComponent,
    SectionsComponent,
    StagesComponent,
    GradesComponent,
    SubjectsComponent,
    TeachersComponent,
    HomeComponent,
    StudentsComponent,
    CreateTeacherModalComponent,
    EditTeacherProfileComponent,
    ModifyTeacherSubjectsComponent,
    MessagesComponent,
    NewMessageComponent,
    RolesComponent,
    ResetPasswordComponent,
    ReportsComponent,
    CreateStageComponent,
    EditStageComponent,
    CreateGradeComponent,
    EditGradeComponent,
    ReportDetailsComponent,
    EditExtraRequestsComponent,
    EditStudenProfile,
    TeacherAmmountingComponent,
    EditSectionComponent,
    AddSectionComponent,
    AboutUsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,

  ]
})
export class MasterPageModule { }
