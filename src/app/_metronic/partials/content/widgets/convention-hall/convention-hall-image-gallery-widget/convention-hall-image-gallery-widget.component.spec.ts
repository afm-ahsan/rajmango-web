import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallImageGalleryWidgetComponent } from './convention-hall-image-gallery-widget.component';

describe('ConventionHallImageGalleryWidgetComponent', () => {
  let component: ConventionHallImageGalleryWidgetComponent;
  let fixture: ComponentFixture<ConventionHallImageGalleryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallImageGalleryWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallImageGalleryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
