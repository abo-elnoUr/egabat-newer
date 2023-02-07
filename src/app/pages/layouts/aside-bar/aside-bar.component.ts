import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BlockLike } from 'typescript';
import { MasterPageComponent } from '../master-page/master-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
// import { RolesTypes } from "../../../helpers/guards/roles.guard";
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';

interface ISidebarItem {
  label: string
  route: string
  icon: string
  role: string[]
}

@Component({
  selector: 'app-aside-bar',
  templateUrl: './aside-bar.component.html',
  styleUrls: ['./aside-bar.component.scss']
})
export class AsideBarComponent implements OnInit {

  @Input("show") showAsidebarInMobiles: any;


  sidebarLinks: ISidebarItem[] = [
    {
      label: "التواصل الإجتماعي",
      route: 'social-links',
      icon: "icofont-ui-social-link",
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'الإعلانات',
      route: 'advertisement',
      icon: 'icofont-presentation',
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'المجموعات',
      route: 'section',
      icon: 'icofont-certificate',
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'المراحل',
      route: 'stages',
      icon: 'icofont-instrument',
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'الفصول الدراسية',
      route: 'semesters',
      icon: 'icofont-certificate-alt-2',
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'الصفوف',
      route: 'grades',
      icon: 'icofont-education',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.LIBRARIES]
    },
    {
      label: 'المواد',
      route: 'subjects',
      icon: 'icofont-book-alt',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.SUBJECTS, "Teacher"]
    },
    {
      label: 'المكتبات',
      route: 'library',
      icon: 'icofont-library',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.SUBJECTS, "Teacher"]
    },
    {
      label: 'المعلمين',
      route: 'teachers',
      icon: 'icofont-teacher',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.TEACHERS]
    },
    {
      label: 'تقارير المعلمين',
      route: 'teacherAmmounting',
      icon: 'icofont-coins',
      role: [RolesEnum.SUPER_ADMIN]
    },
    {
      label: 'الطلاب',
      route: 'students',
      icon: 'icofont-group-students',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.STUDENTS]
    },
    {
      label: 'صندوق الوارد',
      route: 'messages',
      icon: 'icofont-inbox',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.TECH_SUPPORT]
    },
    {
      label: 'تقارير',
      route: 'reports',
      icon: 'icofont-file-alt',
      role: [RolesEnum.SUPER_ADMIN, RolesEnum.REPORTS]
    },
    {
      label: 'إدارة المشرفين',
      route: 'roles',
      icon: 'fa fa-users-cog',
      role: [RolesEnum.SUPER_ADMIN]
    },

    {
      label: 'من نحن',
      route: 'aboutus',
      icon: 'fas fa-question-circle',
      role: [RolesEnum.SUPER_ADMIN]
    },
  ]






  constructor() { }

  ngOnInit(): void {
  }
}
