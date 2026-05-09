import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenseTypeModalComponent } from './create-expense-type-modal.component';

describe('CreateExpenseTypeModalComponent', () => {
  let component: CreateExpenseTypeModalComponent;
  let fixture: ComponentFixture<CreateExpenseTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpenseTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
