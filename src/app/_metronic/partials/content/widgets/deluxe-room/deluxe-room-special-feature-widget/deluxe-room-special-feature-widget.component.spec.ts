import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeluxeRoomSpecialFeatureWidgetComponent } from './deluxe-room-special-feature-widget.component';

describe('DeluxeRoomSpecialFeatureWidgetComponent', () => {
  let component: DeluxeRoomSpecialFeatureWidgetComponent;
  let fixture: ComponentFixture<DeluxeRoomSpecialFeatureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeluxeRoomSpecialFeatureWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeluxeRoomSpecialFeatureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
