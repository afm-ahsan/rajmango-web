import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallBodyWidgetComponent } from './convention-hall-body-widget.component';

describe('ConventionHallBodyWidgetComponent', () => {
  let component: ConventionHallBodyWidgetComponent;
  let fixture: ComponentFixture<ConventionHallBodyWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallBodyWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallBodyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
