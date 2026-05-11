import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { MangoTypeService } from '../mango-type.service';
import { MangoTypeDto } from '../models/mango-type-dto.model';

@Component({
  selector: 'app-view-mango-type-modal',
  templateUrl: './view-mango-type-modal.component.html',
  styleUrls: ['./view-mango-type-modal.component.scss']
})
export class ViewMangoTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  subs = new SubSink();
  isLoading = false;
  mangoTypeDto: MangoTypeDto = {} as MangoTypeDto;

  constructor(
    public modal: NgbActiveModal,
    private mangoTypeService: MangoTypeService
  ) {}

  ngOnInit(): void {
    this.loadMangoType();
  }

  loadMangoType() {
    this.isLoading = true;
    this.subs.sink = this.mangoTypeService.getOne(this.id).subscribe({
      next: (response: any) => {
        this.mangoTypeDto = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  getSweetnessLabel(level: number): string {
    return EnumLabelUtils.getSweetnessLevelLabel(level);
  }

  public createImagePath = (serverPath: string) => {
    const clean = serverPath.startsWith('/') ? serverPath.slice(1) : serverPath;
    return `${environment.apis.default.url}/${clean}`;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}