import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';
import { catchError, shareReplay } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { CreateSubjectDto, ISubject, ISubjectFilterResponse, SubjectQuestionResponse } from 'src/app/helpers/_interfaces/subject';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubjectService {


  constructor(private http: HttpClient, private handleError: HandleErrorService) { }


  getListOfSubjects() {
    return this.http.get<ISubjectFilterResponse>(`${env.API_ROOT}/api/Subject/GetAllSubjects`).pipe(catchError(this.handleError.logError))

  }

  // Get Subjects
  getSubjects(filter: any) {
    return this.http.post<ISubjectFilterResponse>(`${env.API_ROOT}/api/Subject/GetSubjects`, filter).pipe(catchError(this.handleError.logError))
  }

  // Get All Stages
  getAllStages(countryId: string = '') {
    return this.http.get(`${env.API_ROOT}/api/Stage/GetAllStagesAdmin?countryId=${countryId}`).pipe(catchError(this.handleError.logError))
  }

  // Get Grades

  getSubjectsList() {
    return this.http.get<ISubject[]>(`${env.API_ROOT}/api/Subject/GetAllSubjects`).pipe(catchError(this.handleError.logError))
  }



  // Get Grades By Stage ID
  getGradesByStageId(stageId: string) {
    return this.http.get(`${env.API_ROOT}/api/Grade/GetGradesByStageIdAdmin/${stageId}`).pipe(catchError(this.handleError.logError))
  }


  getSubjectBySectionAndGrade(sectionId: string, gradeId: string) {
    return this.http.get<ISubject[]>(`${env.API_ROOT}/api/Subject/GetSubjectsByGradeAndSection?SectionId=${sectionId}&GradeId=${gradeId}`)
  }


  // Get Subject By Id
  getSubjectById(subjectId: string) {
    return this.http.get<ISubject>(`${env.API_ROOT}/api/Subject/GetSubjectById/${subjectId}`).pipe(catchError(this.handleError.logError))
  }


  // Get Subjects By Grade Id
  getSubjectsByGradeId(filter: {
    sectionId: string
    gradeId: string
  }) {
    console.log(filter)
    return this.http.post<ISubjectFilterResponse>(`${env.API_ROOT}/api/Subject/GetSubjects`, filter).pipe(catchError(this.handleError.logError))

  }

  filtrationSubjects(filter: any) {
    return this.http.post<ISubjectFilterResponse>(`${env.API_ROOT}/api/Subject/GetSubjects`, filter).pipe(catchError(this.handleError.logError))
  }


  // Create Subject
  createSubject(subjectData: any) {
    return this.http.post(`${env.API_ROOT}/api/Subject/AddSubject`, subjectData).pipe(catchError(this.handleError.logError))
  }



  // Edit Subject
  editSubject(subjectData: any) {
    return this.http.put(`${env.API_ROOT}/api/Subject/EditSubject`, subjectData).pipe(catchError(this.handleError.logError))
  }


  // Delete Subject
  deleteSubject(subjectId: string) {
    return this.http.delete(`${env.API_ROOT}/api/Subject/DeleteSubject/${subjectId}`).pipe(catchError(this.handleError.logError))
  }


  activation(subjectId: string) {
    return this.http.put(`${env.API_ROOT}/api/Subject/SubjectActivation/${subjectId}`, {})
  }

  // ********************* subject questions *************************
  addSubjectQuestion(question: any){
    return this.http.post(`${env.API_ROOT}/api/SubjectExam/AddSubjectExam`, question).pipe(catchError(this.handleError.logError))
  }

  getSubjectQuestionsBySubjectId(subjectId: string){
    return this.http.get<SubjectQuestionResponse[]>(`${env.API_ROOT}/api/SubjectExam/GetSubjectExamsForWeb/${subjectId}`);
  }

  // getSubjectQuestionByQuestionId(questionId: string){
  //   return this.http.get<SubjectQuestionResponse>(`${env.API_ROOT}/api/SubjectQuestion/GetSubjectQuestionByQuestionId/${questionId}`);
  // }

  // editSubjectQuestion(question: any){
  //   return this.http.put(`${env.API_ROOT}/api/SubjectQuestion/EditSubjectQuestion`, question);
  // }

  deleteQuestion(id: string){
    return this.http.delete(`${env.API_ROOT}/api/SubjectExam/DeleteSubjectExam/${id}`)
  }


}
