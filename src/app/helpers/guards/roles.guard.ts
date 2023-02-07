import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { RolesEnum } from '../enums/roles-enum';
import { IRole } from '../_interfaces/Roles';


// export enum RolesTypes {
//   SuperAdmin = "SuperAdmin",
//   Teacher = "المعلمين",
//   TechnicalSupport = "الدعم الفني",
//   Reports = "التقارير"
// }



// export enum Screens {
//   HomePage = "Home",
//   SectionPage = "Section",
//   StagesPage = "Stages",
//   GradesPage = "Gradges",
//   SubjectsPage = "Subjects",
//   TeachersPage = "Teachers",
//   StudentsPage = "Students",
//   MessagesPage = "Messages",
//   RolesPage = "Roles",
//   Reports = "Reports",
//   teacherAmmounting = "teacherAmmounting"
// }

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

  screens: string[] = [];

  UserRoles: string[] = JSON.parse(localStorage.getItem("UserRoles") || '{}');



  constructor(private router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const isAdmin = this.UserRoles.find(role => role === RolesEnum.SUPER_ADMIN)
    if (isAdmin) {
      return true;
    }
    if (next.data['page'] === "Grades") {
      if (isAdmin)
        return true;
      if (this.UserRoles.includes(RolesEnum.LIBRARIES))
        return true;

      return false;
    }

    if (next.data['page'].includes("Subjects") && this.UserRoles.find(r => r == RolesEnum.SUBJECTS)) {
      return true;
    }


    if (this.UserRoles.includes(next.data['page']) || (localStorage.getItem("UserRoles") || '{}').includes(next.data['page'])) {
      return true;
    }
    else {
      this.router.navigate(["/Admin/dashboard/home"])
      return false;
    }
  }
}
