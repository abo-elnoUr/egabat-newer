import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ResponseCompetitionDto } from 'src/app/helpers/_interfaces/competition';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { environment } from 'src/environments/environment';
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

  constructor(
    private _CompetitionService: CompetitionService,
    private _fb: FormBuilder,
    private _swal: SweetAlertService,
    private _ActivatedRoute: ActivatedRoute,
    private _StageHttpService: StageHttpService,
    private _Router: Router
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
      startDate: [''],
      endDate: [''],
      competitionImage: [this.image],
      timer: [''],
      competitionStageDtos: this._fb.array([])
    })
  }

  get Stages() : FormArray {
    return this.editCompetitionForm.get('competitionStageDtos') as FormArray
  }

  editStages(stageId?: string){
    return this._fb.group({
      stageId: [stageId],
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

  removeFromStagesTable(index: number){
    if (index !== -1){
      this.stages.push(this.viewStages.splice(index, 1)[0])
    }
  }

  getCheckValue(event: any){
    const val = event.target.checked
      this.showStage = val
  }
    // edit
    getCompetitionById(id: string){
      let ids: string[] = [];
      let selectedStages : IStage[] = [];
      this._CompetitionService.getCompetitionById(id).subscribe({
        next: (competiton) => {
          this.competitionById = competiton
          this.image = competiton.image
          this.competitonId = competiton.competitionId
          this.editCompetitionForm.patchValue(competiton)

          ids.forEach(id => {
            this.stages =  this.stages.filter(({stageId}) => stageId != id)
          })
          // this.stages = selectedStages;
        }
      })
    }

    subjectImage: File
    selectImage(event: any){
      const file = event.target.files[0]
      this.subjectImage = event.target.files[0]
      this.editCompetitionForm.get('competitionImage').setValue(file)
    }

    selectStage(event: string){
      this.stages.forEach((s, i) => {
        if(s.stageId == event){
          const stage = this.stages.splice(i, 1)[0]
          this.sendData.push(stage)
          this.viewStages.push(stage)
          this.Stages.push(this.editStages(stage.stageId))
        }
      })
    }

    previewFile() {
      window.open(window.URL.createObjectURL(this.subjectImage));
    }

    editCompetition(){

      const editCompetition = new FormData()
      editCompetition.append('id', this.editCompetitionForm.get('id').value)
      editCompetition.append('address', this.editCompetitionForm.get('address').value)

      if (this.subjectImage) {
        editCompetition.append('competitionImage', this.editCompetitionForm.get('competitionImage').value)
      }
      else{
        editCompetition.append('competitionImage', null)
      }

      editCompetition.append('startDate', this.editCompetitionForm.get('startDate').value)
      editCompetition.append('endDate', this.editCompetitionForm.get('endDate').value)
      editCompetition.append('timer', this.editCompetitionForm.get('timer').value)

      if(this.showStage == false){
         const stages = this.editCompetitionForm.get('competitionStageDtos').value
        for (let i = 0; i < this.viewStages.length; i++) {
          editCompetition.append(`competitionStageDtos[${i}].stageId`, this.viewStages[i]?.stageId ?? '');
        }
      }else{
        editCompetition.append(`competitionStageDtos`, '');
      }


      this._CompetitionService.editCompetition(editCompetition).subscribe({
        next: (reponse) => {
          this._swal.createSuccess()
          this.editCompetitionForm.reset()
          this._Router.navigateByUrl('Admin/dashboard/competition')
        }
      })

    }


}
