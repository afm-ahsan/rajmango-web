import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetAllMangoTypeDto, MangoTypeServiceProxy } from 'src/app/services/client-proxy';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  catalog: any[] = [];

  constructor(
    private mangoTypeProxy: MangoTypeServiceProxy,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.mangoTypeProxy.get().subscribe({
      next: (res) => {
        const types: GetAllMangoTypeDto[] = res.data ?? [];
        this.catalog = types.map((dto) => ({
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
    const map: Record<number, string> = {
      0: 'Low',
      1: 'Medium',
      2: 'High',
      3: 'Very High',
      4: 'Premium',
    };
    return map[grade] ?? 'Medium';
  }

  placeOrder(): void {
    this.router.navigate(['/orders/order-list']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
