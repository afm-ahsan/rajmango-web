import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeluxeRoomImageGalleryWidgetComponent } from './deluxe-room-image-gallery-widget.component';

describe('DeluxeRoomImageGalleryWidgetComponent', () => {
  let component: DeluxeRoomImageGalleryWidgetComponent;
  let fixture: ComponentFixture<DeluxeRoomImageGalleryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeluxeRoomImageGalleryWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeluxeRoomImageGalleryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
