import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { SubSink } from 'subsink';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {
  @Input('appPermission') permissionKey!: UserPermissionKey;

  private subs = new SubSink();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: UserPermissionService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.permissionService.currentPermission$.subscribe(() => {
      this.updateView();
    });
  }

  private updateView(): void {
    if (this.permissionService.hasAccess(this.permissionKey)) {
      if (!this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
