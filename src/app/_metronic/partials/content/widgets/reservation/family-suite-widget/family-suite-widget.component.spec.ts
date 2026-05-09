import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySuiteWidgetComponent } from './family-suite-widget.component';

describe('FamilySuiteWidgetComponent', () => {
  let component: FamilySuiteWidgetComponent;
  let fixture: ComponentFixture<FamilySuiteWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySuiteWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySuiteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
