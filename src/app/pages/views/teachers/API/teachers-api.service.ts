import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeachersApiHandleErrorsService } from './teachers-api-handle-errors.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { ITeacher, ITeachersResponse } from 'src/app/helpers/_interfaces/teacher';
import { ISubject, ISubjectFilterResponse } from 'src/app/helpers/_interfaces/subject';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISubjectPermession } from 'src/app/models/subject-permession.model';
import { stat } from 'fs';

interface responseActiveTeacher {

  "status": string,
  "statusFlag": Boolean

}

@Injectable({
  providedIn: 'root'
})
export class TeachersApiService {

  API_HEADERS = {
    "Authorization": `bearer ${localStorage.getItem("AuthToken")}`
  }

  constructor(private http: HttpClient, private handleError: TeachersApiHandleErrorsService) { }

  // Get All Teahcers
  getTeachers(dataTeahcers: any) {


    return this.http.post<ITeachersResponse>(`${env.API_ROOT}/api/Teacher/GetTeachers`, dataTeahcers).pipe(catchError(this.handleError.logError))
  }

  // Get All Stages
  getStages(countryId: string = '') {
    return this.http.get<Array<IStage>>(`${env.API_ROOT}/api/Stage/GetAllStagesAdmin?countryId=${countryId}`).pipe(catchError(this.handleError.logError))
  }

  // Get Grades By Stage ID
  getGradeByStageId(stageId: string) {
    return this.http.get<Array<IGrade>>(`${env.API_ROOT}/api/Grade/GetGradesByStageIdAdmin/${stageId}`).pipe(catchError(this.handleError.logError))
  }
  // Get All Subjects By Grade Id
  getSubjectByGradeId(filter: any) {

    return this.http.post<ISubjectFilterResponse>(`${env.API_ROOT}/api/Subject/GetSubjects`, { ...filter }).pipe(catchError(this.handleError.logError))
  }

  // Create Teacger
  createTeacher(teacherData: any) {

    console.log('create teacher', teacherData);
    return this.http.post(`${env.API_ROOT}/api/Teacher/AddTeacher`, teacherData).pipe(catchError(this.handleError.logError))
  }


  // Get Teacher By Id
  getTeacherById(teacherId: string) {
    return this.http.get<ITeacher>(`${env.API_ROOT}/api/Teacher/GetTeacherById/${teacherId}`).pipe(catchError(this.handleError.logError))
  }


  // Edit Teacher Profile
  editTeacherProfile(teahcerData: any) {
    return this.http.put(`${env.API_ROOT}/api/Teacher/EditTeacherProfile`, teahcerData).pipe(catchError(this.handleError.logError))
  }

  // Edit Teacher Subjects
  editTeacherSubject(teahcerSubjectsData: any) {
    console.log('sub,it entered')
    return this.http.post(`${env.API_ROOT}/api/Teacher/AddSubjectsToTeacher`, teahcerSubjectsData).pipe(catchError(this.handleError.logError))

  }


  resetTeacherPassword(teacherId: string, newPassword: any) {
    return this.http.post(`${env.API_ROOT}/api/Teacher/TeacherResetPassword`, {
      "userIdentityId": teacherId,
      "newPassword": newPassword
    }).pipe(catchError(this.handleError.logError))
  }

  deleteTeacher(teacherId: string) {

    return this.http.delete(`${env.API_ROOT}/api/Teacher/DeleteTeacher/${teacherId}`).pipe(catchError(this.handleError.logError))

  }


  deleteSubjectFromTeacher(subjectId: string) {

    return this.http.delete(`${env.API_ROOT}/api/Teacher/RemoveSubjectFromTeacher/${subjectId}`).pipe(catchError(this.handleError.logError))

  }



  toggleActiveTeacher(teacherId: string) {
    return this.http.put<responseActiveTeacher>(`${env.API_ROOT}/api/Teacher/TeacherActivation/${teacherId}`, {}).pipe(catchError(this.handleError.logError))
  }

  getSubjectPermessions() {
    return this.http.get<ISubjectPermession[]>(`${env.API_ROOT}/api/Teacher/GetSubjectPermessions`).pipe(catchError(this.handleError.logError))
  }

  deleteOrAddSubjectPermession(teacherId: string, subjectId: string, permession: string, status: boolean) {
    return this.http.patch<boolean>(`${env.API_ROOT}/api/Teacher/DeleteOrAddSubjectPermession?teacherId=${teacherId}&subjectId=${subjectId}&permession=${permession}&status=${status}`, {});
  }

}
