import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallWidgetComponent } from './convention-hall-widget.component';

describe('ConventionHallWidgetComponent', () => {
  let component: ConventionHallWidgetComponent;
  let fixture: ComponentFixture<ConventionHallWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
