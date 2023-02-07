import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HandleErrorService } from './handle-error.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { AuthService } from 'src/app/auth/auth.service';
import { IStage } from 'src/app/helpers/_interfaces/stage';

@Injectable({
  providedIn: 'root'
})
export class StageHttpService {

  constructor(private http: HttpClient, private handleError: HandleErrorService) { }

  // Get All Stages
  getAllStages(countryId: string = '') {
    return this.http.get<Array<IStage>>(`${env.API_ROOT}/api/Stage/GetAllStagesAdmin?countryId=${countryId}`
      // , { headers: this.API_HEADERS }
    ).pipe(catchError(this.handleError.logError))
  }


  // Get Stage By ID
  getStageById(stageId: string) {
    return this.http.get<IStage>(`${env.API_ROOT}/api/Stage/GetStageById/${stageId}`
      // , { headers: this.API_HEADERS }
    ).pipe(catchError(this.handleError.logError))
  }


  // Create Stage
  createStage(stageData: any) {
    return this.http.post(`${env.API_ROOT}/api/Stage/AddStage`, stageData).pipe(catchError(this.handleError.logError))
  }


  // Edit Stage
  editStage(data: any) {
    return this.http.put(`${env.API_ROOT}/api/Stage/EditStage`, data).pipe(catchError(this.handleError.logError))
  }



  // Delete Stage
  deleteStage(stageId: string) {
    return this.http.delete(`${env.API_ROOT}/api/Stage/DeleteStage/${stageId}`
      // , { headers: this.API_HEADERS }
    ).pipe(catchError(this.handleError.logError))
  }

  activation(stageId: string) {
    return this.http.put(`${env.API_ROOT}/api/Stage/StageActivation/${stageId}`, {})
  }

}
