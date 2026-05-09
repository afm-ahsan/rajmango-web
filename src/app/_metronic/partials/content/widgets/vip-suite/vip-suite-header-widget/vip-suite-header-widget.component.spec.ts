import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipSuiteHeaderWidgetComponent } from './vip-suite-header-widget.component';

describe('VipSuiteHeaderWidgetComponent', () => {
  let component: VipSuiteHeaderWidgetComponent;
  let fixture: ComponentFixture<VipSuiteHeaderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VipSuiteHeaderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VipSuiteHeaderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
