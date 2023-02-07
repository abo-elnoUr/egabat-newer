import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Directive({
  selector: '[TeacherPermession]'
})
export class TeacherPermessionDirective {

  RoleFeature: string[] = [];
  @Input()
  set TeacherPermession(subjectPermession: string | string[]) {

    const type = "Teacher";
    console.log('directive param', subjectPermession);
    let teacher = this._apiAuthService.currentUserValue;

    if (teacher.userType !== type)
      return;

    if (teacher.teacherPermession.filter(role => subjectPermession.includes(role) || role === subjectPermession).length > 0) {
      this.container.createEmbeddedView(this.templateRef)
    } else {
      this.container.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private _apiAuthService: AuthService) { }
}
