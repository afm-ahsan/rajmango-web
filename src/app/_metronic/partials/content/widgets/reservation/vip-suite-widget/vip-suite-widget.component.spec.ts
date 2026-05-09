import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipSuiteWidgetComponent } from './vip-suite-widget.component';

describe('VipSuiteWidgetComponent', () => {
  let component: VipSuiteWidgetComponent;
  let fixture: ComponentFixture<VipSuiteWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipSuiteWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VipSuiteWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
