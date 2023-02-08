import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { ILibrary } from 'src/app/helpers/_interfaces/library';
import { MainCategoryResponse } from 'src/app/helpers/_interfaces/custom-library';
@Injectable({
  providedIn: 'root'
})
export class LibrariesService {

  constructor(
    private _http: HttpClient
  ) { }

  getLibrariesForAdmin(gradeId: string) {
    return this._http.get<ILibrary[]>(`${environment.API_ROOT}/api/Library/GetLibrariesForAdmin/${gradeId}`)
  }

  addLibrary(libariryData: any) {
    return this._http.post(`${environment.API_ROOT}/api/Library/AddLibrary`, libariryData)
  }

  deleteLibrary(libraryId: any) {
    return this._http.delete(`${environment.API_ROOT}/api/Library/DeleteLibrary/${libraryId}`)
  }

  // ************************************ New **************************************

  createLibary(library: any) {
    return this._http.post(`${environment.API_ROOT}/api/MainCategory/AddMainCategoryFromGrade`, library)
  }

  getLibrarys(data: any) {
    return this._http.post<MainCategoryResponse[]>(`${environment.API_ROOT}/api/MainCategory/GetMainCategoriesByGrade`, data)
  }

}
