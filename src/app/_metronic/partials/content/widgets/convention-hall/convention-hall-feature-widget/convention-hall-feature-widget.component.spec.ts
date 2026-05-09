import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallFeatureWidgetComponent } from './convention-hall-feature-widget.component';

describe('ConventionHallFeatureWidgetComponent', () => {
  let component: ConventionHallFeatureWidgetComponent;
  let fixture: ComponentFixture<ConventionHallFeatureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallFeatureWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallFeatureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
