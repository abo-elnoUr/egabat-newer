import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionErrorsHandleService {

  constructor() {
    console.log("ERROOOOOOOOOOOOOOR");
   }
  logError(error: HttpErrorResponse) {

    console.log("Error Is", error)
    
    if (error.status < 500 && error.status >= 400) {
      console.log("Error From Front")
      console.log(error.status)
      // alert("Error  Check Internet Connect ")
    } else if (error.status >= 500) {
      console.log("Error From Back")
      console.log(error.status)
      // alert("Server Error ,,  Tell Technical Support ")

    } else {
      console.log(error)
      console.log(error.status)
    }
    return throwError(`There Somgthin Is Wrong`)
  }
}
