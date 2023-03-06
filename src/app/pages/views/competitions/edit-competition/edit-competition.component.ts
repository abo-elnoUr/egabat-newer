import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ResponseCompetitionDto } from 'src/app/helpers/_interfaces/competition';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { environment } from 'src/environments/environment';
import { GradesService } from '../../grades/API/grades.service';
import { StageHttpService } from '../../stages/API/stages-http.service';
import { CompetitionService } from '../api/competition.service';

@Component({
  selector: 'app-edit-competition',
  templateUrl: './edit-competition.component.html',
  styleUrls: ['./edit-competition.component.scss']
})
export class EditCompetitionComponent implements OnInit {


  editCompetitionForm: FormGroup
  competitonId: string
  competitionById: ResponseCompetitionDto
  imageUrl = environment.API_ROOT
  image: string = ''
  listOfStages: IStage[] = []
  stages: IStage[] = []
  showStage: boolean = false
  viewStages: any[] = []
  sendData: any[] = []
  listOfGrades: IGrade[] = []

  constructor(
    private _CompetitionService: CompetitionService,
    private _fb: FormBuilder,
    private _swal: SweetAlertService,
    private _ActivatedRoute: ActivatedRoute,
    private _StageHttpService: StageHttpService,
    private _Router: Router,
    private _GradesService: GradesService
  ) {
    this.competitonId = this._ActivatedRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    document.title = "تعديل المسابقه"
    this.createEditCompetitonForm()

    this.getAllStages(this.competitonId)
  }

  createEditCompetitonForm(){
    this.editCompetitionForm = this._fb.group({
      id: [this.competitonId],
      address: [''],
      start_Date: [''],
      end_Date: [''],
      competitionImage: [this.image],
      timer: [''],
      stageId: [null],
      gradeId: [null],
    })
  }


  getAllStages(id: string){
    this._StageHttpService.getAllStages().subscribe({
      next: (stages) => {
        this.listOfStages = stages
        this.stages = [...this.listOfStages]
        this.getCompetitionById(id);
      }
    })
  }

  getGrades(grades: IGrade) {
    this.editCompetitionForm.get('gradeId').reset()
    this.getAllGrades(grades.stageId)
  }

  getAllGrades(stageId: string) {
    this._GradesService.getGradesByStageId(stageId).subscribe({
      next: (res) => {
        this.listOfGrades = res
      }
    })
  }


  getCheckValue(event: any){
    const val = event.target.checked
      this.showStage = val
  }
    // edit
    getCompetitionById(id: string){
      let ids: string[] = [];
      this._CompetitionService.getCompetitionById(id).subscribe({
        next: (competiton) => {
          this.competitionById = competiton
          this.image = competiton.image
          this.competitonId = competiton.competitionId
          this.editCompetitionForm.patchValue(competiton)
          if(competiton.stageId){
            this.getAllGrades(competiton.stageId)
          }
        }
      })
    }

    subjectImage: File
    selectImage(event: any){
      const file = event.target.files[0]
      this.subjectImage = event.target.files[0]
      this.editCompetitionForm.get('competitionImage').setValue(file)
    }

    previewFile() {
      window.open(window.URL.createObjectURL(this.subjectImage));
    }

    editCompetition(){
      const editCompetition = new FormData()
      editCompetition.append('competitionId', this.editCompetitionForm.get('id').value)
      editCompetition.append('address', this.editCompetitionForm.get('address').value)
      if (this.subjectImage) {
        editCompetition.append('image', this.editCompetitionForm.get('competitionImage').value)
      }
      else{
        editCompetition.append('image', null)
      }

      editCompetition.append('start_Date', this.editCompetitionForm.get('start_Date').value)
      editCompetition.append('end_Date', this.editCompetitionForm.get('end_Date').value)
      editCompetition.append('timer', this.editCompetitionForm.get('timer').value)
      editCompetition.append('stageId', this.editCompetitionForm.get('stageId').value)
      editCompetition.append('gradeId', this.editCompetitionForm.get('gradeId').value)

      this._CompetitionService.editCompetition(editCompetition).subscribe({
        next: (reponse) => {
          this._swal.createSuccess()
          this.editCompetitionForm.reset()
          this._Router.navigateByUrl('Admin/dashboard/competitions')
        }
      })
    }

}
