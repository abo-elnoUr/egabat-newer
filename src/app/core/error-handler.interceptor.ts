import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,   private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    //alert("")
    
    //console.log("Error  Handler Interceptor")

    //console.log({Authorization: `Bearer ${ JSON.parse(localStorage.getItem("AuthToken")) } `})

    
    return next.handle(request).pipe(catchError((err) => {

      console.log("ERROR", err)
      
      if (err.status === 401) {

       // console.log(err)
        // alert(err.status)
        // alert("From Interceptor 401")
        // auto logout if 401 response returned from api
        this.authService.logout(); // The Logout Called Here When Error Status == 401
        // We Need Know Why It Give 401
        // this.router.navigate(['/Admin/login']);
        location.reload(true);
      }

      return of(err)
    }))
  }
}
