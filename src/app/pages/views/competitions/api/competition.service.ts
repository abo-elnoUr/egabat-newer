import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompetitionErrorsHandleService } from './competition-errors-handle.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CompetitionResponse, ResponseCompetitionDto } from 'src/app/helpers/_interfaces/competition';
import { CompetitionQuestionResponse, EditCompetitionQuestionAnswerDto, ResponseCompetitionQuestion } from 'src/app/helpers/_interfaces/competition-question';
import { PaginationDto } from 'src/app/helpers/_interfaces/pagination';
const env = environment;
@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  constructor(private http: HttpClient, private handleError: CompetitionErrorsHandleService) { }

  // ********************************* Competition **************************************

   httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  getAllCompetitions(filter: PaginationDto) {
    return this.http.get<CompetitionResponse>(`${env.API_ROOT}/api/Competition/GetAllCompetitions/?pageSize=${filter.pageSize}&pageNumber=${filter.pageNo}`).pipe(catchError(this.handleError.logError))
  }

  addCompetition(competion:any) {
    return this.http.post(`${env.API_ROOT}/api/Competition/AddCompetition`, competion).pipe(catchError(this.handleError.logError))
  }

  editCompetition(competion: any) {
    return this.http.put(`${env.API_ROOT}/api/Competition/EditCompetition`, competion).pipe(catchError(this.handleError.logError))
  }

  getCompetitionById(competitionId: string) {
    return this.http.get<ResponseCompetitionDto>(`${env.API_ROOT}/api/Competition/GetCompetitionByCompetitionId?competitionId=${competitionId}`).pipe(catchError(this.handleError.logError))
  }

  deleteCompetition(competitionId: string) {
    return this.http.delete(`${env.API_ROOT}/api/Competition/DeleteCompetition?competitionId=${competitionId}`).pipe(catchError(this.handleError.logError))
  }

  // activation(competitionId:string) {
  //   return this.http.put(`${env.API_ROOT}/api/Competition/CompetitionActivation/${competitionId}`, {})
  // }

  // filterDate(filter: FilterDate){
  //   return this.http.post(`${env.API_ROOT}/api/Competition/FilterCompetitionsByDate`, filter).pipe(catchError(this.handleError.logError))
  // }

  // ********************************** Competition question *************************************

  // getAllCompetitionQuestions(filter: any) {
  //   return this.http.post<CompetitionQuestionResponse>(`${env.API_ROOT}/api/CompetitionQuestion/GetCompetitionQuestions`, filter).pipe(catchError(this.handleError.logError))
  // }

  addCompetitionQuestion(competionQuestion:any) {
    return this.http.post(`${env.API_ROOT}/api/CompetitionQuestion/AddCompetitionQuestion`, competionQuestion).pipe(catchError(this.handleError.logError))
  }

  editCompetitionQuestion(competion: any) {
    return this.http.put(`${env.API_ROOT}/api/CompetitionQuestion/EditCompetitionQuestion`, competion).pipe(catchError(this.handleError.logError))
  }

  // getCompetitionQuestionById(competitionQuestionId: string) {
  //   return this.http.get<ResponseCompetitionQuestion>(`${env.API_ROOT}/api/CompetitionQuestion/GetCompetitionQuestionsByCompetitionId/${competitionQuestionId}`).pipe(catchError(this.handleError.logError))
  // }

  getCompetitionQuestionByCompetitionId(competitionId: string) {
    return this.http.get<ResponseCompetitionQuestion[]>(`${env.API_ROOT}/api/CompetitionQuestion/GetCompetitionQuestionsWithAnswers?competitionId=${competitionId}`).pipe(catchError(this.handleError.logError))
  }

  deleteCompetitionQuestion(competitionQuestionId: string) {
    return this.http.delete(`${env.API_ROOT}/api/CompetitionQuestion/DeleteCompetitionQuestionWithAnswers?competitionQuestionId=${competitionQuestionId}`).pipe(catchError(this.handleError.logError))
  }

  // activationCompetionQuestion(competitionQuestionId:string) {
  //   return this.http.put(`${env.API_ROOT}/api/CompetitionQuestion/CompetitionQuestionActivation/${competitionQuestionId}`, {})
  // }

  // ********************************** Competition question answer *************************************

  editCompetitionQuestionAnswer(answer: EditCompetitionQuestionAnswerDto) {
    return this.http.put(`${env.API_ROOT}/api/CompetitionQuestion/EditCompetitionQuestionAnswer`, answer).pipe(catchError(this.handleError.logError))
  }

  deleteCompetitionQuestionAnswer(answerId: string) {
    return this.http.delete(`${env.API_ROOT}/api/CompetitionQuestion/DeleteCompetitionQuestionAnswer?answerId=${answerId}`).pipe(catchError(this.handleError.logError))
  }

}
