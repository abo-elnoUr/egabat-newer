import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { catchError } from 'rxjs/operators';
import { ILessonQuestion } from 'src/app/helpers/_interfaces/lesson-question';
import { HandleErrorService } from './handle-error.service';


@Injectable({
  providedIn: 'root'
})
export class LessonQuestionService {

  constructor(private _http: HttpClient, private _errorHandler: HandleErrorService) { }

  getQuestions(lessonId: string) {
    return this._http.get<ILessonQuestion[]>(`${environment.API_ROOT}/api/LessonQuestion/LessonQuestions/${lessonId}`);
  };
  addQuestion(lessonQuestionData: any) {
    return this._http.post(`${environment.API_ROOT}/api/LessonQuestion/AddLessonQuestion`, lessonQuestionData);
  };
  editQuestion(lessonQuestionData: any) {
    return this._http.put(`${environment.API_ROOT}/api/LessonQuestion/EditLessonQuestion`, lessonQuestionData);
  };
  addAnswer(answerData: any) {
    return this._http.post(`${environment.API_ROOT}/api/LessonQuestion/AddLessonQuestionAnswer`, answerData).pipe(catchError(this._errorHandler.logError));
  };
  deleteQuestion(questionId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/LessonQuestion/DeleteLessonQuestion/${questionId}`);
  };
  // deleteAnswer(answerId: string) {
  //   return this._http.delete(`${environment.API_ROOT}​/api/LessonQuestion/DeleteLessonQuestionAnswer/${answerId}`);
  // };

  deleteAnswer(answerId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/LessonQuestion/DeleteLessonQuestionAnswer/${answerId}`)
  }
}
