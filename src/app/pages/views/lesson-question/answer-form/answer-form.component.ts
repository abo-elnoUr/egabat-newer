import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LessonQuestionService } from '../lesson-question.service';

interface IAnswerForm {
  lessonQuestionId: string
  Answer: string
  AnswerFile: File
  IsRight: string
  Index: number
}

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.scss']
})
export class AnswerFormComponent implements OnInit {

  readonly checkBoxId = `${Math.random()}_${Date.now()}`;

  @Input() lessonQuestionId: string = "";
  @Output() onDelete: EventEmitter<null> = new EventEmitter();
  @Output() onCreated: EventEmitter<boolean> = new EventEmitter(false);
  answerForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _lessonQuestionService: LessonQuestionService
  ) {
    this.answerForm = this._formBuilder.group({
      lessonQuestionId: ["", [Validators.required]],
      Answer: ["", [Validators.required]],
      AnswerFile: ["", [Validators.required]],
      IsRight: [false, [Validators.required]],
      Index: ["", [Validators.required]],
    });
  }

  delete() {
    console.log("asd");
    this.onDelete.emit();
  }

  isDisableFile: boolean = false;

  ngOnInit(): void {
    this.answerForm.get("lessonQuestionId")?.setValue(this.lessonQuestionId);
    this.answerForm.valueChanges.subscribe((values: IAnswerForm) => {

      if (values.Answer) {
        this.answerForm.get("AnswerFile")?.disable({ emitEvent: false });
        this.isDisableFile = true;
        this.answerForm.get('AnswerFile')?.clearValidators();
        this.answerForm.get("AnswerFile")?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.answerForm.get("AnswerFile")?.enable({ emitEvent: false });
        this.isDisableFile = false;
        this.answerForm.get('AnswerFile')?.setValidators(Validators.required);
        this.answerForm.get("AnswerFile")?.updateValueAndValidity({ emitEvent: false });
      }

      if (values.AnswerFile) {
        this.answerForm.get("Answer")?.disable({ emitEvent: false });
        this.answerForm.get('Answer')?.clearValidators();
        this.answerForm.get("Answer")?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.answerForm.get("Answer")?.enable({ emitEvent: false });
        this.answerForm.get('Answer')?.setValidators(Validators.required);
        this.answerForm.get("Answer")?.updateValueAndValidity({ emitEvent: false });
      }
    })
  }

  file!: any;
  uploadFile(e: any) {
    let file: File = e.target.files[0];
    if (!file) {
      return;
    };
    this.answerForm.patchValue({ AnswerFile: file });
    this.file = file;
  }

  removeFile() {
    this.answerForm.get("AnswerFile")?.setValue(null);
    this.file = null;
  }

  mapDataToFormData() {
    let formData = new FormData();
    let form = this.answerForm;
    formData.append("lessonQuestionId", form.get("lessonQuestionId")?.value);
    formData.append("Answer", form.get("Answer")?.value);
    formData.append("AnswerFile", form.get("AnswerFile")?.value);
    formData.append("IsRight", form.get("IsRight")?.value);
    formData.append("Index", form.get("Index")?.value);
    return formData;
  }

  submit() {
    this._lessonQuestionService.addAnswer(this.mapDataToFormData()).subscribe(response => {
      console.log({ AddAnswerForm: response });
      this.onCreated.emit(true)
    })
  }
}
