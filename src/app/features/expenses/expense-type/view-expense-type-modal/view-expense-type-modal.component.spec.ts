import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenseTypeModalComponent } from './view-expense-type-modal.component';

describe('ViewExpenseTypeModalComponent', () => {
  let component: ViewExpenseTypeModalComponent;
  let fixture: ComponentFixture<ViewExpenseTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpenseTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenseTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
