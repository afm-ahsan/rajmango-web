import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySuiteSpecialFeatureWidgetComponent } from './family-suite-special-feature-widget.component';

describe('FamilySuiteSpecialFeatureWidgetComponent', () => {
  let component: FamilySuiteSpecialFeatureWidgetComponent;
  let fixture: ComponentFixture<FamilySuiteSpecialFeatureWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySuiteSpecialFeatureWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySuiteSpecialFeatureWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
