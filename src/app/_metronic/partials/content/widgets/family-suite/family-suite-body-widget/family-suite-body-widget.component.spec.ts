import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySuiteBodyWidgetComponent } from './family-suite-body-widget.component';

describe('FamilySuiteBodyWidgetComponent', () => {
  let component: FamilySuiteBodyWidgetComponent;
  let fixture: ComponentFixture<FamilySuiteBodyWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySuiteBodyWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySuiteBodyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
