import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuestionBankComponent } from './add-question-bank.component';

describe('AddQuestionBankComponent', () => {
  let component: AddQuestionBankComponent;
  let fixture: ComponentFixture<AddQuestionBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuestionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
