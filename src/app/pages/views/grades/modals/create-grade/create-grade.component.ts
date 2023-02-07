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
  selector: 'app-create-grade',
  templateUrl: './create-grade.component.html',
  styleUrls: ['./create-grade.component.scss']
})
export class CreateGradeComponent implements OnInit {

  @Input() modal: any;
  @Input() countries: Array<ICountryModel> = [];
  @ViewChild('SuccessSwal') private successSwal: SwalComponent

  createGradeForm: FormGroup;

  listOfStages: Array<IStage> = [];


  constructor(private GradesService: GradesService, private FormBuild: FormBuilder, private modalService: NgbModal, private GradesMethods: GradesComponent) {
    this.createGradeForm = this.FormBuild.group({
      stageId: ["", [Validators.required]],
      gradeName: ["", [Validators.required, Validators.minLength(2)]],
      index: ["", [Validators.required, Validators.min(1)]]
    })

    this.createGradeForm.valueChanges.subscribe(changes => {
      if (isNaN(changes.index)) {
        this.createGradeForm.patchValue({
          index: changes.index.replace(/[a-z]/gi, "")
        })
      }
    })
  }

  ngOnInit(): void {
    this.GradesService.getAllStages().subscribe(res => {
      this.listOfStages = res
    })
  }

  getgradesByCountryId(id: string) {
    this.GradesService.getAllStages(id).subscribe(res => {
      this.listOfStages = res
    })
  }

  get StageId() { return this.createGradeForm.get('stageId') }
  get GradeName() { return this.createGradeForm.get('gradeName') }
  get StageIndex() { return this.createGradeForm.get('index') }

  createGrade() {

    const gradeData = {
      stageId: this.createGradeForm.controls['stageId'].value,
      gradeName: this.createGradeForm.controls['gradeName'].value,
      index: this.createGradeForm.controls['index'].value,
    }
    if (this.createGradeForm.valid) {

      this.GradesService.createGrade(gradeData).subscribe(res => {
        this.successSwal.fire()
        this.modalService.dismissAll()
        this.GradesMethods.getAllGrades()
      })
    }
  }

}
