import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeluxeRoomBodyWidgetComponent } from './deluxe-room-body-widget.component';

describe('DeluxeRoomBodyWidgetComponent', () => {
  let component: DeluxeRoomBodyWidgetComponent;
  let fixture: ComponentFixture<DeluxeRoomBodyWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeluxeRoomBodyWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeluxeRoomBodyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
