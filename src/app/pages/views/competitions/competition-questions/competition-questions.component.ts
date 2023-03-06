import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { CompetitionQuestionResponse, ResponseCompetitionQuestion, ResponseCompetitionQuestionAnswer } from 'src/app/helpers/_interfaces/competition-question';
import { CompetitionService } from '../api/competition.service';

@Component({
  selector: 'app-competition-questions',
  templateUrl: './competition-questions.component.html',
  styleUrls: ['./competition-questions.component.scss']
})
export class CompetitionQuestionsComponent implements OnInit {

  isLoading: boolean
  closeResult: string = ''
  competitionId: string = ''
  questionId: string = ''
  answerId: string = ''
  competitionName: string = ''
  pagination = {
    pageSize: 10,
    pageNo: 1,
  }
  listOfQuestions: CompetitionQuestionResponse[] = []
  listOfAnswers: ResponseCompetitionQuestionAnswer[] = []
  competitionQuestion: ResponseCompetitionQuestion[] = []

  editAnswerForm: FormGroup

  constructor(
    private _formBulider: FormBuilder,
    private _swal: SweetAlertService,
    private modalService: NgbModal,
    private _ActivatedRoute: ActivatedRoute,
    private _CompetitionService: CompetitionService,
  ) {
    this.competitionId = this._ActivatedRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    document.title = 'اسئله المسابقات'
    this.createEditAnswerFrom()

    // call function
    this.getCompetitionQuestionByCompetitionId()
  }

  createEditAnswerFrom(){
    this.editAnswerForm = this._formBulider.group({
      answer_Text: [''],
      is_Selected: [false],
      question_Id:[this.questionId],
      answer_Id: [this.answerId]
    })
  }


  getCompetitionQuestionByCompetitionId(){
    this._CompetitionService.getCompetitionQuestionByCompetitionId(this.competitionId).subscribe({
      next: (questions) => {
        this.competitionQuestion = questions
        if(questions.length > 0){
          this.competitionName = questions[0].competition_Name
        }
      }
    })
  }


  openAnswersModal(content: any, answers: any, questionId: string) {
    this.listOfAnswers = answers
    this.questionId = questionId
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openEditAnswer(content: any, answer: string, isSelected: boolean){
    this.editAnswerForm.get('answer_Text').setValue(answer)
    this.editAnswerForm.get('is_Selected').setValue(isSelected)
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
  }

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  getAnswerById(answerId: string){
    this.answerId = answerId
  }

  warningDeleting(id: string) {
    this._swal.warningDeleting().then((result) => {
      if (result.isConfirmed) {
        this.deleteCompetitionQuestion(id);
      }
    });
  }

  deleteCompetitionQuestion(id: string) {
    this._CompetitionService.deleteCompetitionQuestion(id).subscribe((response) => {
      this._swal.deleteSuccess();
      this.getCompetitionQuestionByCompetitionId()
    });
  }

  editAnswers(){
    this.editAnswerForm.get('question_Id').setValue(this.questionId)
    this.editAnswerForm.get('answer_Id').setValue(this.answerId)

    this._CompetitionService.editCompetitionQuestionAnswer(this.editAnswerForm.value).subscribe({
      next: (res) => {
        this._swal.updateSuccess()
        this.getCompetitionQuestionByCompetitionId()
      }
    })
  }

  warningDeleteAnswer(answerId: string) {
    this._swal.warningDeleting().then((result) => {
      if (result.isConfirmed) {
        this.deleteCompetitionQuestionAnswer(answerId);
      }
    });
  }


  deleteCompetitionQuestionAnswer(answerId: string){
    this._CompetitionService.deleteCompetitionQuestionAnswer(answerId).subscribe({
      next: (res) => {
        this._swal.deleteSuccess()
        this.getCompetitionQuestionByCompetitionId()
      }
    })
  }



}
