import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { StateService } from 'src/app/helpers/services/state.service';
import { ILessonQuestion } from 'src/app/helpers/_interfaces/lesson-question';
import { LessonQuestionService } from './lesson-question.service';
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';
@Component({
  selector: 'app-lesson-question',
  templateUrl: './lesson-question.component.html',
  styleUrls: ['./lesson-question.component.scss']
})
export class LessonQuestionComponent implements OnInit {
  ROLES = RolesEnum;
  SITE_URL = `${environment.API_ROOT}/`;
  subjectName: string = '';
  unitName: string;
  lessonName: string;
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;

  subjectId: string = '';
  unitId: string = '';
  listOfQuestions: ILessonQuestion[] = [];

  constructor(
    private _lessonQuestionService: LessonQuestionService,
    private _activateRoute: ActivatedRoute,
    private _stateService: StateService


  ) {

    _stateService.currentLesson.subscribe(z => this.lessonName = z);
    _stateService.currentSubject.subscribe(z => this.subjectName = z);
    _stateService.currentUnit.subscribe(z => this.unitName = z);


    this.subjectId = _activateRoute.snapshot.params['subjectId'];
    this.unitId = _activateRoute.snapshot.params['unitId'];

  }

  ngOnInit(): void {
    document.title = `${environment.webSiteName} | الدروس`
    this.getQuestions();
  }

  addAnswer(questionIndex: number) {
    let questionAnswers = this.listOfQuestions[questionIndex].answers;
    if (questionAnswers.length >= 4) return;
    questionAnswers.push({
      isNew: true,
      index: 0,
      lessonQuestionAnswerId: "",
      answer: "",
      isRight: false
    });
  }

  removeNewQuestion(questionIndex: number, answerIndex: number) {
    let questionAnswers = this.listOfQuestions[questionIndex].answers;
    questionAnswers.splice(answerIndex, 1);
    console.log("DDDD");

    // Start Work From Here (:
  }

  getQuestions() {
    this._lessonQuestionService.getQuestions(this._activateRoute.snapshot.params['lessonId']).subscribe(response => {
      response.map(q => {
        return q.answers.map(a => {
          return a.isNew = false
        })
      })
      this.listOfQuestions = response;
      console.log(response);

    })
  }

  deleteQuestion(questionId: string) {
    console.log(questionId);
  }

  deleteAnswer(answerId: string) {
    console.log(answerId);
    this._lessonQuestionService.deleteAnswer(answerId).subscribe(response => {
      this.getQuestions();
    })
  }

}
