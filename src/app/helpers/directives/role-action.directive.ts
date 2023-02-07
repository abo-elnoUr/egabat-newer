import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Directive({
  selector: '[RoleAction]'
})
export class RoleActionDirective {

  RoleFeature: string[] = [];
  @Input()
  set RoleAction(actionId: string | string[]) {
    if (this._apiAuthService.currentUserValue.roles.filter(role => actionId.includes(role)).length > 0) {
      this.container.createEmbeddedView(this.templateRef)
    } else {
      this.container.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>,
    private container: ViewContainerRef,
    private _apiAuthService: AuthService) { }
}
