import { Component, OnInit, ViewChild } from '@angular/core';
import { StageHttpService } from './API/stages-http.service';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';

const env = environment
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ICountryModel } from '../../../models/country.model';
import { CountryService } from '../../../shared/country.service';


interface IStage {
  stageId: string
  stageName: string
  index: Number
}



@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
})
export class StagesComponent implements OnInit {
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  closeResult = '';
  countries: Array<ICountryModel> = [];
  listOfStages: any;
  deleteStageId: string = "";
  sendRequest: Boolean = false;


  editingStageId: string = ""






  createNewStage: FormGroup;

  public countryId: string;

  getAllCountries() {
    this.countryService.getAllCountries().subscribe(res => this.countries = res);
  }


  constructor(private HttpMethods: StageHttpService,
    private modalService: NgbModal, private FB: FormBuilder,
    private countryService: CountryService) {


    this.createNewStage = this.FB.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email, Validators.pattern('.*com$')]],
      number: ["", [Validators.required, Validators.minLength(5)]],
      password: ["",],
      confirmPassword: "",
      birthYear: ["", [Validators.min(1970), Validators.max(2005)]],
      address: this.FB.group({
        city: ["", Validators.required],
        street: ["", Validators.required],
      })
    })

  }


  ngOnInit(): void {
    document.title = `${env.webSiteName} | المراحل`
    this.getAllCountries();
    this.getAllStages()

  }


  getCountrySections(id: string) {
    this.countryId = id;
    this.getAllStages();
  }

  getAllStages() {
    this.HttpMethods.getAllStages(this.countryId).subscribe(res => {
      this.listOfStages = res;
    })
  }








  delteteStage() {
    this.HttpMethods.deleteStage(this.deleteStageId).subscribe(res => {
      this.successSwal.fire()
      this.getAllStages()
    })
  }









  open(content: any, stageId: string) {
    this.editingStageId = stageId
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }


  openAddModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
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

  toggleStageActivation(stageId: string) {
    this.HttpMethods.activation(stageId).subscribe((response: any) => {
      Swal.fire(
        `عملية ناجحة`,
        ` تم ${response.statusFlag ? '' : 'الغاء'} التفعيل بنجاح `,
        `success`
      )
    })
  }

}
