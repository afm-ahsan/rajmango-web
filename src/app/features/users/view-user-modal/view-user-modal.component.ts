import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { UserDto } from '../models/user-dto.model';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
})
export class ViewUserModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() roleName: string;

  subs = new SubSink();
  isLoading = false;
  userDto: UserDto = {} as UserDto;
  avatarLoadError = false;

  constructor(
    public modal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.subs.sink = this.userService.getItem(this.id).subscribe(
      (res: any) => {
        this.userDto = res.data;
        this.avatarLoadError = false;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.modal.dismiss();
      }
    );
  }

  get fullName(): string {
    const first = this.userDto?.firstName?.trim() ?? '';
    const last  = this.userDto?.lastName?.trim()  ?? '';
    return [first, last].filter(Boolean).join(' ') || this.userDto?.userName || '—';
  }

  get displayRoleName(): string {
    return this.userDto?.roleName || this.roleName || '—';
  }

  avatarUrl(): string {
    if (this.avatarLoadError || !this.userDto?.imagePath?.trim()) {
      return 'assets/media/avatars/blank.png';
    }
    const path = this.userDto.imagePath;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${environment.apis.default.url}/${clean}`;
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/media/avatars/blank.png';
    this.avatarLoadError = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}