import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ResponseCompetitionDto } from 'src/app/helpers/_interfaces/competition';
import Swal from 'sweetalert2';
import { CompetitionService } from '../api/competition.service';

@Component({
  selector: 'app-add-competition-questions',
  templateUrl: './add-competition-questions.component.html',
  styleUrls: ['./add-competition-questions.component.scss']
})
export class AddCompetitionQuestionsComponent implements OnInit {

  competitionId: string = ''
  addCompetionQuestionForm: FormGroup
  competitionById: ResponseCompetitionDto

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _formBulider: FormBuilder,
    private _CompetitionService: CompetitionService,
    private _swal: SweetAlertService,

  ) {
     this.competitionId = this._ActivatedRoute.snapshot.params['id']
}

  ngOnInit(): void {
    document.title = 'اسئله المسابقات'

    this.createCopmetitionQuestionFrom()
    this.getCompetitionById()
  }

  createCopmetitionQuestionFrom(){
    this.addCompetionQuestionForm = this._formBulider.group({
      question: [''],
      competition_Id: [this.competitionId],
      question_Image: [null],
      createCompetitionQuestionAnswerDtos: this._formBulider.array([])
    })
  }

  uploadQuestionImage(event:any){
    const file = event.target.files[0]
    this.addCompetionQuestionForm.get('question_Image').setValue(file)
  }

  get Answers() : FormArray {
    return this.addCompetionQuestionForm.get('createCompetitionQuestionAnswerDtos') as FormArray;
  }

  newAnswers() {
    return this._formBulider.group({
      answer_Dto: [''],
      is_SelectedDto: [false]
    })
  }

  mustSelect: boolean = false

  chooseCorrectAnswer(index: number){
    this.Answers.controls.forEach(c => {
      c.get('is_SelectedDto').setValue(false)
      this.mustSelect = false
    })
    this.Answers.controls[index].get('is_SelectedDto').setValue(true)
    this.mustSelect = true

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

  removeAnswer(i: number) {
    if(this.Answers.length > 1)
      this.Answers.removeAt(i);
  }

  getCompetitionById(){
    this._CompetitionService.getCompetitionById(this.competitionId).subscribe({
      next: (competiton) => {
        this.competitionById = competiton
      }
    })
  }

  addQuestion(){

    const questionForm = new FormData()
    questionForm.append('question', this.addCompetionQuestionForm.get('question').value)
    questionForm.append('question_Image', this.addCompetionQuestionForm.get('question_Image').value)
    questionForm.append('competition_Id', this.addCompetionQuestionForm.get('competition_Id').value)


    const answers = this.addCompetionQuestionForm.get('createCompetitionQuestionAnswerDtos').value

    for (let i = 0; i < answers.length; i++) {
      questionForm.append(`createCompetitionQuestionAnswerDtos[${i}].answer_Dto`, answers[i]?.answer_Dto ?? '');
      questionForm.append(`createCompetitionQuestionAnswerDtos[${i}].is_SelectedDto`, answers[i]?.is_SelectedDto ?? '');
      if(answers[i]?.is_SelectedDto != true){
        console.log('no selected');
      }

    }

    this._CompetitionService.addCompetitionQuestion(questionForm).subscribe({
      next: (response) => {
        this._swal.createSuccess()
        this.addCompetionQuestionForm.reset()
        this._Router.navigateByUrl(`Admin/dashboard/competition-question/${this.competitionId}`)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


}
