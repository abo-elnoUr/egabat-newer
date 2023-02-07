import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ICountryModel } from '../../../../../models/country.model';
import { StageHttpService } from '../../API/stages-http.service';
import { StagesComponent } from '../../stages.component';

@Component({
  selector: 'app-edit-stage',
  templateUrl: './edit-stage.component.html',
  styleUrls: ['./edit-stage.component.scss']
})
export class EditStageComponent implements OnInit {

  @Input('stageID') stageId: string = ""
  @Input('countries') countries: Array<ICountryModel> = [];

  requestStatus: Boolean = false


  editStageForm: FormGroup;

  @Input() modal: any;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;

  constructor(private HttpMethods: StageHttpService, private modalService: NgbModal, private StagePageMethods: StagesComponent,
    private FormBuild: FormBuilder) {


    this.editStageForm = this.FormBuild.group({
      stageName: ["", [Validators.required]],
      index: ["", [Validators.required, Validators.min(1)]],
      countryId: ['', [Validators.required]]
    })

    this.editStageForm.valueChanges.subscribe(changes => {
      if (isNaN(changes.index)) {
        this.editStageForm.patchValue({
          index: changes.index.replace(/[a-z]/gi, "")
        })
      }
    })

  }

  ngOnInit(): void {
    this.getStageById(this.stageId)
  }

  getStageById(id: string) {
    this.HttpMethods.getStageById(id).subscribe(res => {
      this.editStageForm.patchValue({
        index: res.index,
        stageName: res.stageName,
        countryId: res.countryId
      })
    })
  }
  get StageName() { return this.editStageForm.get('stageName') }
  get StageIndex() { return this.editStageForm.get('index') }
  get CountryId() { return this.editStageForm.get('countryId') }


  editStage() {
    this.requestStatus = true


    let data = {
      "stageName": this.editStageForm.controls['stageName'].value,
      "index": this.editStageForm.controls['index'].value,
      "stageId": this.stageId,
      "countryId": this.editStageForm.controls['countryId'].value
    }

    if (!this.editStageForm.invalid) {
      this.HttpMethods.editStage(data).subscribe(res => {
        this.modalService.dismissAll()
        this.successSwal.fire()
        this.StagePageMethods.getAllStages()
        this.requestStatus = false
      })
    }

  }


}
