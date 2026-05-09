import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionHallHeaderWidgetComponent } from './convention-hall-header-widget.component';

describe('ConventionHallHeaderWidgetComponent', () => {
  let component: ConventionHallHeaderWidgetComponent;
  let fixture: ComponentFixture<ConventionHallHeaderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionHallHeaderWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionHallHeaderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
