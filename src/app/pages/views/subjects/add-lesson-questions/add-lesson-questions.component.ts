import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
import Swal from 'sweetalert2';
import { SubjectService } from '../Api/api-http.service';

@Component({
  selector: 'app-add-lesson-questions',
  templateUrl: './add-lesson-questions.component.html',
  styleUrls: ['./add-lesson-questions.component.scss']
})
export class AddLessonQuestionsComponent implements OnInit {

  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @Input() modal: any;

  addQuestionForm: FormGroup
  addAnswerForm: FormGroup
  subjectId: string = ''
  subjectById: ISubject
  mustSelect: boolean = false

  constructor(
    private _FormBuilder: FormBuilder,
    private modalService : NgbModal,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _SubjectService: SubjectService
  ) {
    this.subjectId = this._ActivatedRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    document.title = "اضافه اسئله للماده"
    this.createQuestionForm()

    // call functions
    this.getSubjectById()
  }
  createQuestionForm(){
    this.addQuestionForm = this._FormBuilder.group({
      Subject_Id: [this.subjectId],
      Question_Image: [null],
      Question_Text: ["", Validators.required],
      AddSubjectExamAnswerDtos: this._FormBuilder.array([this.newAnswers()])
    })
  }

  getSubjectById(){
    this._SubjectService.getSubjectById(this.subjectId).subscribe({
      next: (subject) => {
        this.subjectById = subject
      }
    })
  }

  questionImage(event: any){
    const file = event.target.files[0]
    this.addQuestionForm.get('Question_Image').setValue(file)
  }

  get Answers() : FormArray {
    return this.addQuestionForm.get('AddSubjectExamAnswerDtos') as FormArray;
  }

  newAnswers() {
    return this._FormBuilder.group({
      Answer_text: [''],
      Is_Selected: [false]
    })
  }

  addAnswer(){
    if (this.Answers.length >= 4) {
      Swal.fire({
        title: 'اقصي عدد للاجابات 4',
        icon: 'warning',
        timerProgressBar: true,
      })
    } else {
      this.Answers.push(this.newAnswers())
    }
  }


  chooseCorrectAnswer(index: number){
    this.Answers.controls.forEach(c => {
      c.get('Is_Selected').setValue(false)
      this.mustSelect = false
    })
    this.Answers.controls[index].get('Is_Selected').setValue(true)
    this.mustSelect = true
  }

  removeAnswer(i: number) {
    if(this.Answers.length > 1)
      this.Answers.removeAt(i);
  }

  addQuestion() {
    const questionForm = new FormData()
    questionForm.append('Subject_Id', this.addQuestionForm.get('Subject_Id').value)
    questionForm.append('Question_Image', this.addQuestionForm.get('Question_Image').value)
    questionForm.append('Question_Text', this.addQuestionForm.get('Question_Text').value)

    const answers = this.addQuestionForm.get('AddSubjectExamAnswerDtos').value

    for (let i = 0; i < answers.length; i++) {
      questionForm.append(`AddSubjectExamAnswerDtos[${i}].Answer_text`, answers[i]?.Answer_text ?? '');
      questionForm.append(`AddSubjectExamAnswerDtos[${i}].Is_Selected`, answers[i]?.Is_Selected ?? '');
    }

    if ( this.addQuestionForm.valid) {
      this._SubjectService.addSubjectQuestion(questionForm).subscribe({
        next: (added) => {
          this.successSwal.fire()
          this.resetForm()
        }
      })
    }
  }

  resetForm(){
    this.addQuestionForm.reset()
    this.addQuestionForm.get('AddSubjectExamAnswerDtos').reset()
    this.Answers.clear()
    this.newAnswers()
  }


}
