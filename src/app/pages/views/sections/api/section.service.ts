import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SectionErrorsHandleService } from './section-errors-handle.service';
import { environment } from 'src/environments/environment';

const env = environment
import { catchError } from 'rxjs/operators';
import { IAddSection, ISection } from 'src/app/models/sections.model';

@Injectable({
  providedIn: 'root'
})
export class SectionService {


  constructor(private http: HttpClient, private handleError: SectionErrorsHandleService) { }



  getAllSections(countryId: string = '') {
    return this.http.get<ISection[]>(`${env.API_ROOT}/api/Section/GetAllSectionsAdmin?countryId=${countryId}`).pipe(catchError(this.handleError.logError))

  }

  addSection(section: IAddSection) {
    return this.http.post(`${env.API_ROOT}/api/Section/AddSection`, section).pipe(catchError(this.handleError.logError))

  }

  editSection(section: ISection) {
    return this.http.put(`${env.API_ROOT}/api/Section/EditSection`, section).pipe(catchError(this.handleError.logError))
  }


  deleteSection(sectionId: string) {
    return this.http.delete(`${env.API_ROOT}/api/Section/DeleteSection/${sectionId}`)
  }

  activation(sectionId: string) {
    return this.http.put(`${env.API_ROOT}/api/Section/SectionActivation/${sectionId}`, {})
  }

}
