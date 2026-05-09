import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallSpecialFeatureWidgetComponent } from './convention-hall-special-feature-widget.component';

describe('ConventionHallSpecialFeatureWidgetComponent', () => {
  let component: ConventionHallSpecialFeatureWidgetComponent;
  let fixture: ComponentFixture<ConventionHallSpecialFeatureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallSpecialFeatureWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallSpecialFeatureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
