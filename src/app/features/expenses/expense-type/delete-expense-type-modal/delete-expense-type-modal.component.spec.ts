import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenseTypeModalComponent } from './delete-expense-type-modal.component';

describe('DeleteExpenseTypeModalComponent', () => {
  let component: DeleteExpenseTypeModalComponent;
  let fixture: ComponentFixture<DeleteExpenseTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteExpenseTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteExpenseTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
