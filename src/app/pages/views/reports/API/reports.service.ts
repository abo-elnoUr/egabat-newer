import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportsHandleErrorsService } from './reports-handle-errors.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment
import { IDashboardReport, IReport } from 'src/app/helpers/_interfaces/Reports';
import { RequestDetails } from '../modals/report-details/report-details.component';



@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient, private handleError: ReportsHandleErrorsService) { }

  getDashboardReport() {
    return this.http.get<IDashboardReport>(`${env.API_ROOT}/api/Report/DashboardReport`)
  }


  getAllRequestsReport() {
    return this.http.post<IReport>(`${env.API_ROOT}/api/Report/GetRequestsReport`, {
      "pageNo": 1,
      "pageSize": 20
    }).pipe(catchError(this.handleError.logError))
  }


  getReportsWithFilter(filter: any) {
    console.log("Filter", filter)
    return this.http.post<IReport>(`${env.API_ROOT}/api/Report/GetRequestsReport`, filter).pipe(catchError(this.handleError.logError))
  }


  getReportDetails(requestId: string) {
    return this.http.get<RequestDetails>(`${env.API_ROOT}/api/Report/GetRequestReportDetails/${requestId}`).pipe(catchError(this.handleError.logError))
  }


  changeImageExtention(fileName: any) {
    return this.http.put(`${env.API_ROOT}/api/Report/ChangeImageExtension`, {
      "fileName": fileName
    }).pipe(catchError(this.handleError.logError))
  }



  deleteAnswerFromRequest(answerId: string) {

    return this.http.delete(`${env.API_ROOT}/api/Answer/DeleteAnswerFromRequest/${answerId}`).pipe(catchError(this.handleError.logError))

  }


}
