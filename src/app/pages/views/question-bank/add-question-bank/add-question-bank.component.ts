import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { IQuestion } from './../../../../models/questions-bank';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { QuestionsBankService } from '../questions-bank.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-question-bank',
  templateUrl: './add-question-bank.component.html',
  styleUrls: ['./add-question-bank.component.scss']
})
export class AddQuestionBankComponent implements OnInit {

  subjectId: string = '';
  questionId: string;
  addForm: FormGroup;
  listOfQuestions: string[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private service: QuestionsBankService,
    private snapShot: ActivatedRoute,
    private _router: Router,
    private _SW: SweetAlertService,
    private location: Location
  ) {
    this.subjectId = snapShot.snapshot.params['subjectId'];
    this.questionId = snapShot.snapshot.params['id'];
    this.addForm = _formBuilder.group({
      answer: ['', [Validators.required]],
      subjectId: [this.subjectId, Validators.required],
      questions: _formBuilder.array([], Validators.required),
      data: ['']
    });
  }
  update = false;
  ngOnInit(): void {
    if (this.questionId) {
      this.update = true;
      this.getQuestionToUpdate(this.questionId);
    } else {
      // this.addQuestion()
    }
  }

  get Questions(): FormArray {
    return this.addForm.get("questions") as FormArray;
  }

  addQuestion(question = '') {
    // question = this.replace(question);
    // console.log('addQuestion',question);
    this.Questions.push(this.question(question));
  }

  question(question = ''): FormGroup {
    return this._formBuilder.group({
      question: [question, Validators.required],
    });
  }
  addToListOfQuestions(question: string) {
    if (question.trim() != '') {
      question = question.trim();
      question = this.replace(question);
      this.listOfQuestions.push(question);
      this.addQuestion(question);
      this.addForm.get('data')?.reset();
    }
  }
  removeFromQuestionList(i: number) {
    this.listOfQuestions.splice(i, 1);
    if (this.Questions.length > 0) {
      this.Questions.removeAt(i);
    }
  }
  submit() {
    if (this.Questions.length < 1) return;
    if (this.update) {
      this.saveUpdate();
    } else {
      this.service.addQuestion(this.addForm.value)
        .subscribe(res => {
          this._SW.createSuccess();
          this._router.navigate([`/Admin/dashboard/subjects/${this.subjectId}/questions-bank`])
        });
    }
  }
  saveUpdate() {
    this.service.editQuestion(this.addForm.value)
      .subscribe(res => {
        this._SW.updateSuccess();
        this._router.navigate([`/Admin/dashboard/subjects/${this.subjectId}/questions-bank`])
      })
  }
  removeQuestion(i: number) {
    this.Questions.removeAt(i);
  }
  getQuestionToUpdate(id: string) {
    this.addForm.addControl('id', new FormControl(id, Validators.required))
    this.service.getQuestionById(id)
      .subscribe(question => {
        question.questions.forEach(question => {
          this.listOfQuestions.push(question.question);
          this.addQuestion(question.question)
        })
        this.addForm.patchValue(question);
      })
  }
  goBack() {
    this.location.back();
  }
  replace(value: string) {
    value = value.replace(/أ|إ|آ/gi, "ا");
    value = value.replace(/ة/gi, "ه");
    value = value.replace(/ّ|َ|ً|ُ|ِ|ٍ|ْ|َّ|ًّ|ُّ|ِّ|ٍّ|ّْ/gi, "");
    console.log('in Replace', value)
    return value;
  }
}
