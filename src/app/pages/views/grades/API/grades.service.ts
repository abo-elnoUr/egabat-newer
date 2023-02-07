import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { GradeResponseDto, IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGradesGetAll } from 'src/app/models/grades.model';
@Injectable({
  providedIn: 'root'
})
export class GradesService {

  API_HEADERS = {
    "Authorization": `bearer ${localStorage.getItem("AuthToken")}`
  }

  constructor(private http: HttpClient, private handleError: HandleErrorService) { }

  // Get All Stages
  getAllStages(countryId: string = '') {
    return this.http.get<Array<IStage>>(`${env.API_ROOT}/api/Stage/GetAllStagesAdmin?countryId=${countryId}`).pipe(catchError(this.handleError.logError))
  }


  // Get All Grades
  getAllGrades(filter: any) {
    return this.http.post<IGradesGetAll>(`${env.API_ROOT}/api/Grade/GetGrades`, filter).pipe(catchError(this.handleError.logError))
  }

  // Create New Grade
  createGrade(gradeData: any) {
    return this.http.post(`${env.API_ROOT}/api/Grade/AddGrade`, {
      "stageId": gradeData.stageId,
      "gradeName": gradeData.gradeName,
      "index": parseInt(gradeData.index),
    }).pipe(catchError(this.handleError.logError))
  }



  // Delete Grade
  deleteGrade(gradeId: string) {
    return this.http.delete(`${env.API_ROOT}/api/Grade/DeleteGrade/${gradeId}`).pipe(catchError(this.handleError.logError))
  }

  // Get Grade By ID
  getGeadeByID(gradeId: string) {
    return this.http.get<GradeResponseDto>(`${env.API_ROOT}/api/Grade/GetGradeById/${gradeId}`).pipe(catchError(this.handleError.logError))
  }


  // Get Grades By Stage ID
  getGradesByStageId(stageId: string) {
    return this.http.get<IGrade[]>(`${env.API_ROOT}/api/Grade/GetGradesByStageIdAdmin/${stageId}`).pipe(catchError(this.handleError.logError))
  }


  // Edit Grade
  editGrade(gradeData: any) {
    return this.http.put(`${env.API_ROOT}/api/Grade/EditGrade`, {
      "gradeId": gradeData.gradeId,
      "gradeName": gradeData.gradeName,
      "stageId": gradeData.stageId,
      "index": parseInt(gradeData.index)
    }).pipe(catchError(this.handleError.logError))
  }


  activation(gradeId: string) {
    return this.http.put(`${env.API_ROOT}/api/Grade/GradeActivation/${gradeId}`, {})
  }

}
