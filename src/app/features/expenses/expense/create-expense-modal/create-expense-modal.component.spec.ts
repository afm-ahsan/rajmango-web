import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpenseModalComponent } from './create-expense-modal.component';

describe('CreateExpenseModalComponent', () => {
  let component: CreateExpenseModalComponent;
  let fixture: ComponentFixture<CreateExpenseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpenseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
