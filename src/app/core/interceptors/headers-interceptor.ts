import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    constructor(private authService:AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // We Will Add Our Logic Here
        // const myToken = "bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJnaXZlbl9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluIiwibmFtZWlkIjoiNGIwZGUxMWItNGRjZS00M2VmLWI4YTUtODA4NjdhMThkZTg5IiwibmJmIjoxNjAzMjMyMjU2LCJleHAiOjE2MDQ0NDU0NTYsImlhdCI6MTYwMzIzMjI1Nn0.LnNny6hJsDrmb7IBsuqD6dWvMD8hfuAgthobwkK8ir2m-AoFuxx9BsqNCZQSPPjNUeHc0-lcfRPZsgJ1prCT1A";

        // const modifiedReq = req.clone({
        //     url: req.url.replace("http", "https"),
        //     headers: req.headers.set("Authorization", myToken)

        // })

        let currentUser = this.authService.currentUserValue;
        // console.log(currentUser);
        if (currentUser && currentUser.token) {

            // console.log({Authorization: `Bearer ${ JSON.parse(localStorage.getItem("AuthToken")) } `})
            
            //console.log("CurrentUser", currentUser)
            
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                    // , AcceptLanguage:'ar-EG'
                }
            });
        }
        
        // console.log('Interceptors', req, next)
        return next.handle(req);
        // return next.handle(req)

    }

}