import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { ISemester } from 'src/app/helpers/_interfaces/semesters';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor(
    private _http: HttpClient
  ) { }


  getSemesters(subjectId: string = '') {
    return this._http.get<ISemester[]>(`${environment.API_ROOT}/api/Semester/GetSemesters?subjectId=${subjectId}`)
  }



  getSemesterById(semesterId: string) {
    return this._http.get<ISemester>(`${environment.API_ROOT}/api/Semester/GetSemesterById/${semesterId}`)
  }

  createSemester(semesterData: any) {
    return this._http.post(`${environment.API_ROOT}/api/Semester/AddSemester`, semesterData)
  }

  updateSemester(semesterData: any) {
    console.log("semester Data", semesterData)
    return this._http.put(`${environment.API_ROOT}/api/Semester/EditSemester`, semesterData)
  }

  deleteSemester(semesterId: string) {
    return this._http.delete(`${environment.API_ROOT}/api/Semester/DeleteSemester/${semesterId}`)
  }

  semesterActivation(semesterId: string) {
    return this._http.get<ISemester>(`${environment.API_ROOT}/api/Semester/SemesterActivation/${semesterId}`)
  }



}
