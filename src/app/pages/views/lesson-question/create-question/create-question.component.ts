import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { LessonQuestionService } from '../lesson-question.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  @Output() onDelete: EventEmitter<null> = new EventEmitter();
  questionForm: FormGroup;
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;
  subjectId: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _lessonQuestionService: LessonQuestionService,
    private _activateRoute: ActivatedRoute
  ) {
    this.questionForm = this._formBuilder.group({
      LessonId: ["", [Validators.required]],
      Question: ["", [Validators.required]],
      QuestionFile: ["", [Validators.required]],
      Index: ["", [Validators.required]],
    });
    this.subjectId = _activateRoute.snapshot.params['subjectId'];
  }

  delete() {
    //console.log("asd");
    this.onDelete.emit();
  }

  isDisableFile: boolean = false;

  ngOnInit(): void {
    this.questionForm.get("LessonId")?.setValue(this._activateRoute.snapshot.params['lessonId']);

    this.questionForm.valueChanges.subscribe((values) => {

      if (values.Question) {
        this.questionForm.get("QuestionFile")?.disable({ emitEvent: false });
        this.isDisableFile = true;
        this.questionForm.get('QuestionFile')?.clearValidators();
        this.questionForm.get("QuestionFile")?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.questionForm.get("QuestionFile")?.enable({ emitEvent: false });
        this.isDisableFile = false;
        this.questionForm.get('QuestionFile')?.setValidators(Validators.required);
        this.questionForm.get("QuestionFile")?.updateValueAndValidity({ emitEvent: false });
      }

      if (values.QuestionFile) {
        this.questionForm.get("Question")?.disable({ emitEvent: false });
        this.questionForm.get('Question')?.clearValidators();
        this.questionForm.get("Question")?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.questionForm.get("Question")?.enable({ emitEvent: false });
        this.questionForm.get('Question')?.setValidators(Validators.required);
        this.questionForm.get("Question")?.updateValueAndValidity({ emitEvent: false });
      }
    })
  }

  file!: any;
  uploadFile(e: any) {
    let file: File = e.target.files[0];
    if (!file) {
      return;
    };
    this.questionForm.patchValue({ QuestionFile: file });
    this.file = file;
  }

  removeFile() {
    this.questionForm.get("QuestionFile")?.setValue(null);
    this.file = null;
  }

  mapDataToFormData() {
    let formData = new FormData();
    let form = this.questionForm;
    formData.append("LessonId", form.get("LessonId")?.value);
    formData.append("Question", form.get("Question")?.value);
    formData.append("QuestionFile", form.get("QuestionFile")?.value);
    formData.append("Index", form.get("Index")?.value);
    return formData;
  }

  submit() {
    this._lessonQuestionService.addQuestion(this.mapDataToFormData()).subscribe(response => {
      //console.log(response);
      // this.delete();
      window.history.back();
    })
  }

}
