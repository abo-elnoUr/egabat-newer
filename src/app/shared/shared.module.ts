import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleActionDirective } from '../helpers/directives/role-action.directive';
import { TeacherPermessionDirective } from '../helpers/directives/teacher-permession';



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
    TeacherPermessionDirective
  ]
})
export class SharedModule { }
