import { IGetQuestionById } from './../../../models/questions-bank';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { IQuestionBankResponse } from 'src/app/models/questions-bank';


@Injectable({
  providedIn: 'root'
})
export class QuestionsBankService {

  constructor(private _http: HttpClient) { }

  getQuestions(filter: any) {
    return this._http.post<IQuestionBankResponse>(`${environment.API_ROOT}/api/QuestionsBank/GetQuestions`, filter);
  }
  addQuestion(question: any) {
    return this._http.post(`${environment.API_ROOT}/api/QuestionsBank/Create`, question)
  }

  delete(id: string) {
    return this._http.delete(`${environment.API_ROOT}/api/QuestionsBank/Delete/${id}`);
  }
  getQuestionById(id: string) {
    return this._http.get<IGetQuestionById>(`${environment.API_ROOT}/api/QuestionBank/GetById/${id}`);
  }
  editQuestion(question: IGetQuestionById) {
    return this._http.put(`${environment.API_ROOT}/api/QuestionBank/Update`, question);
  }
}
