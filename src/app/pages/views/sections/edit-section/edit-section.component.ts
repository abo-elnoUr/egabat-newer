import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ICountryModel } from '../../../../models/country.model';
import { SectionService } from '../api/section.service';
import { SectionsComponent } from '../sections.component';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.scss']
})
export class EditSectionComponent implements OnInit {
  @Input("sectionId") sectionId: string = ""
  @Input("sectionName") sectionName: string = ""
  @Input("index") sectionIndex: number = 0;
  @Input("countryId") countryId: string = "";
  @Input() countries: Array<ICountryModel> = [];
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @Input() modal: any;

  editSectionForm: FormGroup

  constructor(private _formBulider: FormBuilder, private modalService: NgbModal, private _sectionService: SectionService, private _sectionComponent: SectionsComponent) {


  }

  ngOnInit(): void {
    this.editSectionForm = this._formBulider.group({
      countryId: this.countryId,
      sectionId: this.sectionId,
      sectionName: [this.sectionName, [Validators.required, Validators.minLength(3)]],
      index: [this.sectionIndex]
    })

  }

  edit() {
    console.log("Value", this.editSectionForm.value)
    this._sectionService.editSection(this.editSectionForm.value).subscribe(res => {
      this.modalService.dismissAll()
      this.successSwal.fire()
      this._sectionComponent.getAllSections()
    })

  }

}
