import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeluxeRoomWidgetComponent } from './deluxe-room-widget.component';

describe('DeluxeRoomWidgetComponent', () => {
  let component: DeluxeRoomWidgetComponent;
  let fixture: ComponentFixture<DeluxeRoomWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeluxeRoomWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeluxeRoomWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
