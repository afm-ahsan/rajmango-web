import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  MangoAvailabilityDto,
  MangoAvailabilityServiceProxy,
  MangoAvailabilityStatus,
} from 'src/app/services/client-proxy';
import { MangoTypeService } from 'src/app/features/mango-types/mango-type.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { SubSink } from 'subsink';
import { SignalRService } from 'src/app/shared/services/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  carouselImages: string[] = [
    'assets/media/carousel/img2.jpg',
    'assets/media/carousel/img3.jpg',
    'assets/media/carousel/img4.jpg',
    'assets/media/carousel/img5.jpg',
    'assets/media/carousel/img6.jpg',
    'assets/media/carousel/img7.jpg',
    'assets/media/carousel/img8.jpg',
    'assets/media/carousel/img9.jpg',
    'assets/media/carousel/img10.jpg',
  ];

  mangoList: any[] = [];
  isLoading = false;
  subs = new SubSink();

  constructor(
    private mangoTypeService: MangoTypeService,
    private availabilityProxy: MangoAvailabilityServiceProxy,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef,
    private imagePathService: ImagePathService
  ) {}

  ngOnInit(): void {
    this.loadMangoTypes();
    this.subs.sink = this.signalR.catalogUpdated$.subscribe(() => this.loadMangoTypes());
  }

  private loadMangoTypes(): void {
    this.isLoading = true;
    this.subs.sink = forkJoin([
      this.mangoTypeService.list(),
      this.availabilityProxy.get(),
    ]).subscribe({
      next: ([typesRes, availRes]) => {
        const types: any[] = typesRes.data ?? [];
        const availabilities: MangoAvailabilityDto[] = availRes.data ?? [];

        this.mangoList = types.map((type) => {
          const avail = this.bestAvailability(availabilities, type.id);
          return {
            id: type.id,
            mangoTypeId: type.id,
            name: type.name,
            image: this.resolveImage(type.imagePath),
            description: type.description,
            region: type.region,
            averageWeight: type.averageWeight,
            sweetness: EnumLabelUtils.getSweetnessLevelLabel(type.sweetnessLevel ?? 0),
            price: avail?.pricePerKg ?? null,
            availabilityStatus: avail?.status ?? null,
            availabilityLabel: avail
              ? EnumLabelUtils.getMangoAvailabilityStatusLabel(avail.status)
              : 'Not Listed',
            statusBadgeClass: avail
              ? EnumLabelUtils.getMangoAvailabilityStatusBadgeClass(avail.status)
              : 'badge-light-dark',
            isAvailable:
              avail?.status === MangoAvailabilityStatus._1 ||
              avail?.status === MangoAvailabilityStatus._2,
            seasonYear: avail?.seasonYear ?? null,
            availabilityNotes: avail?.notes ?? null,
          };
        });
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  private bestAvailability(
    availabilities: MangoAvailabilityDto[],
    mangoTypeId: number
  ): MangoAvailabilityDto | undefined {
    const forType = availabilities.filter((a) => a.mangoTypeId === mangoTypeId);
    if (!forType.length) return undefined;
    const priority: Record<number, number> = { 1: 0, 2: 1, 0: 2, 3: 3 };
    return forType.sort(
      (a, b) => (priority[a.status] ?? 9) - (priority[b.status] ?? 9)
    )[0];
  }

  private resolveImage(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/media/avatars/blank.png';
    return this.imagePathService.createFullPath(imagePath);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
