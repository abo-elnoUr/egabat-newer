import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor() { }

  logError(error: HttpErrorResponse) {
    console.log({ error });

    if (error.status < 500 && error.status >= 400) {
      console.log("Error From Front")
      console.log(error.status)
      console.log(error)
      if (error.status === 400) {
        Swal.mixin({
          toast: true,
          title: "حدث خطأ",
          text: error.error.errors.message,
          icon: "error",
          timer: 3000,
          position: "center",
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        }).fire()
      }
      // alert("Error  Check Internet Connect ")
    } else if (error.status >= 500) {
      console.log("Error From Back")
      console.log(error.status)
      // alert("Server Error ,,  Tell Technical Support ")
      console.log(error)

    } else {
      console.log(error)
      console.log(error.status)
    }
    return throwError(`There Somgthin Is Wrong`)
  }
}
