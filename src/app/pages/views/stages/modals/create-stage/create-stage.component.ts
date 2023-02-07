import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ICountryModel } from '../../../../../models/country.model';
import { StageHttpService } from '../../API/stages-http.service';
import { StagesComponent } from '../../stages.component';


interface INewStage {
  stageName: string,
  index: Number
}

@Component({
  selector: 'app-create-stage',
  templateUrl: './create-stage.component.html',
  styleUrls: ['./create-stage.component.scss']
})
export class CreateStageComponent implements OnInit {

  @Input() modal: any;
  @Input() countries: Array<ICountryModel> = [];
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  requestStatus: Boolean = false // This Variable Use To Toggle Disable & Enable Submit Button
  // newStageData: INewStage = {
  //   stageName: "",
  //   index: 0
  // };

  createStageForm: FormGroup;

  constructor(
    private HttpMethods: StageHttpService,
    private modalService: NgbModal,
    private StagePageMethods: StagesComponent,
    private FormBuild: FormBuilder) {


    this.createStageForm = this.FormBuild.group({
      stageName: ["", [Validators.required]],
      index: ["", [Validators.required, Validators.min(1)]],
      countryId: ['', [Validators.required]]
    })

    this.createStageForm.valueChanges.subscribe(changes => {
      if (isNaN(changes.index)) {
        this.createStageForm.patchValue({
          index: changes.index.replace(/[a-z]/gi, "")
        })
      }
    })

  }

  get StageName() { return this.createStageForm.get('stageName') }
  get StageIndex() { return this.createStageForm.get('index') }
  get CountryId() { return this.createStageForm.get('countryId') }



  ngOnInit(): void {
  }

  createStage() {

    if (!this.createStageForm.invalid) {
      const stageData = {
        index: this.createStageForm.controls['index'].value,
        stageName: this.createStageForm.controls['stageName'].value,
        countryId: this.createStageForm.controls['countryId'].value
      }
      // this.sendRequest = true
      this.requestStatus = true
      this.HttpMethods.createStage(stageData).subscribe(res => {
        this.modalService.dismissAll()
        this.successSwal.fire()
        this.StagePageMethods.getAllStages()
        // this.sendRequest = false;
        this.requestStatus = false

      })
    }







  }

}
