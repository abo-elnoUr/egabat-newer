import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { GradesService } from '../../grades/API/grades.service';
import { StageHttpService } from '../../stages/API/stages-http.service';
import { CompetitionService } from '../api/competition.service';

@Component({
  selector: 'app-add-competition',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.scss']
})
export class AddCompetitionComponent implements OnInit {

  addCompetitionForm: FormGroup
  showStage: boolean = false
  listOfStages: IStage[] = []
  listOfGrades: IGrade[] = []
  sendData: any[] = []

  constructor(
    private _StageHttpService: StageHttpService,
    private _CompetitionService: CompetitionService,
    private _fb: FormBuilder,
    private _swal: SweetAlertService,
    private _Router: Router,
    private _GradesService: GradesService
  ) { }

  ngOnInit(): void {
    document.title = 'اضافه مسابقه'
    this.createAddCompetitonForm()
    // call function
    this.getAllStages()
  }

  createAddCompetitonForm() {
    this.addCompetitionForm = this._fb.group({
      address: [''],
      start_Date: [''],
      end_Date: [''],
      timer: [''],
      image: [null],
      stageId: [null],
      gradeId: [null]
    })
  }

  uploadCompetitonImage(event: any) {
    const file = event.target.files[0]
    this.addCompetitionForm.get('image').setValue(file)
  }


  getCheckValue(event: any) {
    const val = event.target.checked
    this.showStage = val
  }


  getAllStages() {
    this._StageHttpService.getAllStages().subscribe({
      next: (stages) => {
        this.listOfStages = stages
      }
    })
  }

  getGrades(grades: IGrade) {
    this.getAllGrades(grades.stageId)
  }


  getAllGrades(stageId: string) {
    this._GradesService.getGradesByStageId(stageId).subscribe({
      next: (res) => {
        this.listOfGrades = res
      }
    })
  }


  addCompetition() {
    console.log(this.addCompetitionForm.getRawValue());


    const addCompetition = new FormData()
    addCompetition.append('address', this.addCompetitionForm.get('address').value)
    addCompetition.append('image', this.addCompetitionForm.get('image').value)
    addCompetition.append('start_Date', this.addCompetitionForm.get('start_Date').value)
    addCompetition.append('end_Date', this.addCompetitionForm.get('end_Date').value)
    addCompetition.append('timer', this.addCompetitionForm.get('timer').value)
    addCompetition.append('stageId', this.addCompetitionForm.get('stageId').value)
    addCompetition.append('gradeId', this.addCompetitionForm.get('gradeId').value)


    this._CompetitionService.addCompetition(addCompetition).subscribe({
      next: (response) => {
        this._swal.createSuccess()
        this.addCompetitionForm.reset()
        this._Router.navigateByUrl('Admin/dashboard/competitions')
      },
      error: (error) => {
        console.log(error);

      }
    })
  }

}
