import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { QuestionResponseDto, SubjectQuestionAnswerResponse, SubjectQuestionResponse } from 'src/app/helpers/_interfaces/subject';
import { environment } from 'src/environments/environment';
import { SubjectService } from '../Api/api-http.service';

@Component({
  selector: 'app-lesson-questions',
  templateUrl: './lesson-questions.component.html',
  styleUrls: ['./lesson-questions.component.scss']
})
export class LessonQuestionsComponent implements OnInit {

  pagination = {
    pageSize: 10,
    pageNo: 1,
  }
  listOfQuestions: QuestionResponseDto
  isLoading: boolean;
  closeResult = '';
  listOfAnswers: SubjectQuestionAnswerResponse[] = []
  questionId: string = ''
  subjectQuestionById: SubjectQuestionResponse
  subjectId: string = ''
  editQuestionForm: FormGroup;
  subjectQuestions: SubjectQuestionResponse[] = []
  imgUrl = environment.API_ROOT
  subjectName: string

  constructor(
    private _swal: SweetAlertService,
    private modalService: NgbModal,
    private _ActivatedRoute: ActivatedRoute,
    private _FormBuilder: FormBuilder,
    private _SubjectService: SubjectService
  ) {
    this.subjectId = this._ActivatedRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    document.title = 'اسئله الماده'

    this.getSubjectQuestionsBySubjectId()
    this.createEditQuestion()
  }

  open(content: any, answers: any) {
    this.listOfAnswers = answers
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  openEdit(content: any, id: string) {
    this.questionId = id

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

  createEditQuestion(){
    this.editQuestionForm = this._FormBuilder.group({
      question: [''],
      subjectQuestionAnswerResponse: this._FormBuilder.array([])
    })
  }

  get Answers() : FormArray {
    return this.editQuestionForm.get('subjectQuestionAnswerResponse') as FormArray
  }

  editAnswers(questionAnswer?:string, isTrue?:boolean){
    return this._FormBuilder.group({
      questionAnswer: [questionAnswer],
      isTrue: [isTrue]
    })
  }

  // getSubjectQuestionByQuestionId(questionId: string){
  //   this._SubjectService.getSubjectQuestionByQuestionId(questionId).subscribe({
  //     next: (response) => {
  //       this.subjectQuestionById = response
  //       response.responseSubjectQuestionAnswerDtos.forEach(a => {
  //         this.Answers.push(this.editAnswers(a.questionAnswer, a.isTrue))
  //       })
  //       this.editQuestionForm.patchValue(response)
  //     }
  //   })
  // }

  getSubjectQuestionsBySubjectId(){
    this._SubjectService.getSubjectQuestionsBySubjectId(this.subjectId).subscribe({
      next: (questions) => {
        this.subjectQuestions = questions
        this.subjectName = questions[0].subject_Name
      }
    })
  }


  deleteQuestion(id: string) {
    this._SubjectService.deleteQuestion(id).subscribe((response) => {
      this._swal.deleteSuccess();
      this.getSubjectQuestionsBySubjectId()
    });
  }

  warningDeleting(id: string) {
    this._swal.warningDeleting().then((result) => {
      if (result.isConfirmed) {
        this.deleteQuestion(id);
      }
    });
  }

}
