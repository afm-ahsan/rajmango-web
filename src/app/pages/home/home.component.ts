import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GetAllMangoTypeDto, MangoTypeServiceProxy } from 'src/app/services/client-proxy';
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
    private mangoTypeProxy: MangoTypeServiceProxy,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMangoTypes();
    this.subs.sink = this.signalR.catalogUpdated$.subscribe(() => this.loadMangoTypes());
  }

  private loadMangoTypes(): void {
    this.isLoading = true;
    this.subs.sink = this.mangoTypeProxy.get().subscribe({
      next: (res) => {
        const types: GetAllMangoTypeDto[] = res.data ?? [];
        this.mangoList = types.map((dto) => ({
          id: dto.id,
          name: dto.name,
          image: this.resolveImage(dto.imagePath),
          price: dto.pricePerKg,
          isAvailable: dto.isAvailable,
          sweetness: this.resolveSweetness(dto.mangoGrade as number),
        }));
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  private resolveImage(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/media/mangos/default.jpg';
    const filename = imagePath.split('/').pop() ?? 'default.jpg';
    return `assets/media/mangos/${filename}`;
  }

  private resolveSweetness(grade: number): string {
    const map: Record<number, string> = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Very High', 4: 'Premium' };
    return map[grade] ?? 'Medium';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
