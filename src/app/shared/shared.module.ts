import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleActionDirective } from '../helpers/directives/role-action.directive';
import { TeacherPermessionDirective } from '../helpers/directives/teacher-permession';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    RoleActionDirective,
    TeacherPermessionDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RoleActionDirective,
    TeacherPermessionDirective,
    NgSelectModule
  ]
})
export class SharedModule { }
