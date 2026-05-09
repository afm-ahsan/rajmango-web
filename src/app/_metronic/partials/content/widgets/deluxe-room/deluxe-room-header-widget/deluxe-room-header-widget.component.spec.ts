import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeluxeRoomHeaderWidgetComponent } from './deluxe-room-header-widget.component';

describe('DeluxeRoomHeaderWidgetComponent', () => {
  let component: DeluxeRoomHeaderWidgetComponent;
  let fixture: ComponentFixture<DeluxeRoomHeaderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeluxeRoomHeaderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeluxeRoomHeaderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
