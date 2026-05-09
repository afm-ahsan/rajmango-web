import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipSuiteBodyWidgetComponent } from './vip-suite-body-widget.component';

describe('VipSuiteBodyWidgetComponent', () => {
  let component: VipSuiteBodyWidgetComponent;
  let fixture: ComponentFixture<VipSuiteBodyWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipSuiteBodyWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VipSuiteBodyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
