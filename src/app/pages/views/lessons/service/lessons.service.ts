import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { Injectable } from '@angular/core';
import { IActivationResponse } from 'src/app/helpers/_interfaces/activation-response';
import { ILesson, ILessonDetails } from 'src/app/helpers/_interfaces/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(
    private _http: HttpClient
  ) { };


  createLesson(lessonData: any) {
    return this._http.post(`${environment.API_ROOT}/api/Lesson/AddLesson`, lessonData)
  }

  getLessons(unitId: string) {
    return this._http.get<ILesson[]>(`${environment.API_ROOT}/api/Lesson/GetUnitLessonsForAdmin/${unitId}`)
  }


  getLessonById(lessonId: string) {
    return this._http.get<ILessonDetails>(`${environment.API_ROOT}/api/Lesson/GetUnitLessonByIdForAdmin/${lessonId}`)
  }

  updateLesson(lessonData: any) {
    return this._http.put(`${environment.API_ROOT}/api/Lesson/EditLesson`, lessonData)

  }

  deleteLesson(lessonId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/Lesson/DeleteLesson/${lessonId}`)
  }

  activationLesson(lessonId: string) {
    return this._http.put<IActivationResponse>(`${environment.API_ROOT}/api/Lesson/LessonActivation/${lessonId}`, {})
  }

  deleteLessonAttachment(attachmentId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/Lesson/DeleteLessonAttachment/${attachmentId}`)
  }

}
