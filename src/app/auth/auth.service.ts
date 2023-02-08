import { Injectable, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IRole } from '../helpers/_interfaces/Roles';
import { environment } from 'src/environments/environment';

const env = environment

interface IUser {
  id: string;
  token: string;
  userName: string;
  expirationDate: string;
  roles: string[];
  message: string;
  unauthorized: boolean;
  userType: string,
  teacherPermession: Array<string>
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient, private route: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('AuthToken') || '{}'))
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  public static screens: string[] = [];



  // المواد
  // الطلاب
  login(userData: any) {
    //console.log(userData, 'hello from service')
    return this.http.post<IUser>(`${env.API_ROOT}/api/Admin/Login`, userData).pipe(map(user => {
      // console.log(user.roles)
      if (user.token != null) {

        localStorage.setItem('AuthToken', JSON.stringify(user));

        localStorage.setItem("UserRoles", JSON.stringify(user.roles))

        this.currentUserSubject.next(user);
      }
      return user;
    }))
  }

  logout() {
    localStorage.removeItem('AuthToken') // Just In Logout But Look
    this.route.navigate(['/Admin/login'])
    this.currentUserSubject.next(null);
  }

}


// import { Injectable } from '@angular/core';
// import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuardService  implements CanActivate  {
//   public static Screens:string[]=[];
//   constructor(private router: Router) { }
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     if (RoleGuardService.Screens.includes(route.data.ScreenName)||localStorage.getItem('RoleScreen').includes(route.data.ScreenName)) {
//       //console.log(localStorage.getItem('RoleScreen'));
//       return true;
//     } else {
//       //console.log(route.data.ScreenName,RoleGuardService.Screens)
//       this.router.navigate([`NotAuthorized`]);
//       // this.router.navigate(['/Admin/cps/home']);
//       return false;
//     }
//   }
// }
