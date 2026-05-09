import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySuiteHeaderWidgetComponent } from './family-suite-header-widget.component';

describe('FamilySuiteHeaderWidgetComponent', () => {
  let component: FamilySuiteHeaderWidgetComponent;
  let fixture: ComponentFixture<FamilySuiteHeaderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySuiteHeaderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySuiteHeaderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
