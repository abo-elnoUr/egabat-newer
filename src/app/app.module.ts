import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { MasterPageModule } from './pages/master-page/master-page.module';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { HeadersInterceptor } from './core/interceptors/headers-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { EditUserRoleComponent } from './pages/views/roles/edit-user-role/edit-user-role.component';
import { SemestersComponent } from './pages/views/semesters/semesters.component';
import { EditSemesterComponent } from './pages/views/semesters/edit-semester/edit-semester.component';
import { AddSemesterComponent } from './pages/views/semesters/add-semester/add-semester.component';
import { UnitsComponent } from './pages/views/units/units.component';
import { AddUnitComponent } from './pages/views/units/add-unit/add-unit.component';
import { EditUnitComponent } from './pages/views/units/edit-unit/edit-unit.component';
import { LessonsComponent } from './pages/views/lessons/lessons.component';
import { AddLessonComponent } from './pages/views/lessons/add-lesson/add-lesson.component';
import { SharedModule } from './shared/shared.module';
import { EditLessonComponent } from './pages/views/lessons/edit-lesson/edit-lesson.component';
import { LibrariesComponent } from './pages/views/libraries/libraries.component';
import { CreateLibraryComponent } from './pages/views/libraries/create-library/create-library.component';
import { AdvertismentComponent } from './pages/views/advertisment/advertisment.component';
import { CreateAdvertisementComponent } from './pages/views/advertisment/create-advertisement/create-advertisement.component';
import { SocialLinksComponent } from './pages/views/social-links/social-links.component';
import { LessonQuestionComponent } from './pages/views/lesson-question/lesson-question.component';
import { AnswerFormComponent } from './pages/views/lesson-question/answer-form/answer-form.component';
import { CreateQuestionComponent } from './pages/views/lesson-question/create-question/create-question.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QuestionBankComponent } from './pages/views/question-bank/question-bank.component';
import { AddQuestionBankComponent } from './pages/views/question-bank/add-question-bank/add-question-bank.component';
import { CustomLibraryComponent } from './pages/views/custom-library/custom-library.component';
import { LibraryCategoryComponent } from './pages/views/custom-library/library-category/library-category.component';
import { LibrarySubCategoryComponent } from './pages/views/custom-library/library-sub-category/library-sub-category.component';
import { LibraryAttachmentComponent } from './pages/views/custom-library/library-attachment/library-attachment.component';
import { EditLibraryAttachmentComponent } from './pages/views/custom-library/edit-library-attachment/edit-library-attachment.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AddLessonQuestionsComponent } from './pages/views/subjects/add-lesson-questions/add-lesson-questions.component';
import { LessonQuestionsComponent } from './pages/views/subjects/lesson-questions/lesson-questions.component';
import { CompetitionsComponent } from './pages/views/competitions/competitions.component';
import { AddCompetitionComponent } from './pages/views/competitions/add-competition/add-competition.component';
import { EditCompetitionComponent } from './pages/views/competitions/edit-competition/edit-competition.component';
import { AddCompetitionQuestionsComponent } from './pages/views/competitions/add-competition-questions/add-competition-questions.component';
import { CompetitionQuestionsComponent } from './pages/views/competitions/competition-questions/competition-questions.component';
import { AddSubjectComponent } from './pages/views/subjects/add-subject/add-subject.component';


registerLocaleData(en);



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditUserRoleComponent,
    SemestersComponent,
    EditSemesterComponent,
    AddSemesterComponent,
    UnitsComponent,
    AddUnitComponent,
    EditUnitComponent,
    LessonsComponent,
    AddLessonComponent,
    EditLessonComponent,
    LibrariesComponent,
    CreateLibraryComponent,
    AdvertismentComponent,
    CreateAdvertisementComponent,
    SocialLinksComponent,
    LessonQuestionComponent,
    AnswerFormComponent,
    CreateQuestionComponent,
    QuestionBankComponent,
    AddQuestionBankComponent,
    CustomLibraryComponent,
    LibraryCategoryComponent,
    LibrarySubCategoryComponent,
    LibraryAttachmentComponent,
    EditLibraryAttachmentComponent,
    AddLessonQuestionsComponent,
    LessonQuestionsComponent,
    CompetitionsComponent,
    AddCompetitionComponent,
    EditCompetitionComponent,
    AddCompetitionQuestionsComponent,
    CompetitionQuestionsComponent,
    AddSubjectComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MasterPageModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    QRCodeModule,
    NgbDropdownModule,

  ],
  providers: [AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
