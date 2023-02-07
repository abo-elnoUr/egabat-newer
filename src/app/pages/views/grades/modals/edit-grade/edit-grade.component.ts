import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ICountryModel } from '../../../../../models/country.model';
import { GradesService } from '../../API/grades.service';
import { GradesComponent } from '../../grades.component';

@Component({
  selector: 'app-edit-grade',
  templateUrl: './edit-grade.component.html',
  styleUrls: ['./edit-grade.component.scss']
})
export class EditGradeComponent implements OnInit {

  @Input() modal: any;
  @Input() gradeId: string;
  @Input() countries: Array<ICountryModel> = [];

  currentGrade: IGrade

  editGradeForm: FormGroup;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent

  listOfStages: Array<IStage> = [];


  constructor(private GradesService: GradesService, private FormBuild: FormBuilder, private modalService: NgbModal, private GradesMethods: GradesComponent) {
    this.editGradeForm = this.FormBuild.group({
      stageId: ["", [Validators.required]],
      gradeName: ["", [Validators.required, Validators.minLength(2)]],
      index: ["", [Validators.required, Validators.min(1)]],
      countryId: ['']
    })

    this.editGradeForm.valueChanges.subscribe(changes => {
      if (isNaN(changes.index)) {
        this.editGradeForm.patchValue({
          index: changes.index.replace(/[a-z]/gi, "")
        })
      }
    })
  }
  getgradesByCountryId(id: string) {
    this.GradesService.getAllStages(id).subscribe(res => {
      this.listOfStages = res
    })
  }
  ngOnInit(): void {
    this.GradesService.getAllStages().subscribe(res => {
      this.listOfStages = res
    })
    this.GradesService.getGeadeByID(this.gradeId).subscribe(res => {
      this.currentGrade = res
      this.getgradesByCountryId(res.countryId);
      this.editGradeForm.patchValue({
        countryId: res.countryId,
        stageId: res.stageId,
        index: res.index,
        gradeName: res.gradeName,

      })
      // this.GradesService.getAllStages(res.countryId).subscribe(t=>
      //   {
      //     this.listOfStages=t;
      //     this.editGradeForm.patchValue({stageId:res.stageId});
      // });

    })
  }


  get StageId() { return this.editGradeForm.get('stageId') }
  get GradeName() { return this.editGradeForm.get('gradeName') }
  get StageIndex() { return this.editGradeForm.get('index') }

  createGrade() {

    const gradeData = {
      gradeId: this.currentGrade.gradeId,
      stageId: this.editGradeForm.controls['stageId'].value,
      gradeName: this.editGradeForm.controls['gradeName'].value,
      index: this.editGradeForm.controls['index'].value,
    }

    console.log(gradeData)

    if (this.editGradeForm.valid) {


      this.GradesService.editGrade(gradeData).subscribe(res => {
        this.successSwal.fire()
        this.modalService.dismissAll()
        this.GradesMethods.getAllGrades()
      })
    }
  }


}
