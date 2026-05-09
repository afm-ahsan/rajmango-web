import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  @Input('appPermission') permissionKey!: UserPermissionKey;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: UserPermissionService
  ) {}

  ngOnInit(): void {
    const hasAccess = this.permissionService.hasAccess(this.permissionKey);
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
