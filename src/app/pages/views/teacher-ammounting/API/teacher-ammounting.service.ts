import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleErrorService } from './teacher-ammounting-errors-handler.service';
import { catchError } from "rxjs/operators"
import { environment } from 'src/environments/environment';

const env = environment


export interface ITeacherAmmounting {
  request: number
  repliedRequest: number
  repliedInTimeRequest: number
  notRepliedRequest: number
}

@Injectable({
  providedIn: 'root'
})
export class TeacherAmmountService {


  constructor(private http: HttpClient, private handleError: HandleErrorService) { }


  filterTeacherReports(data: any) {

    console.log("Filter Data Is", data)

    return this.http.post<ITeacherAmmounting>(`${env.API_ROOT}/api/Report/GetTeacherRequestReport`, data).pipe(catchError(this.handleError.logError))
  }


}
