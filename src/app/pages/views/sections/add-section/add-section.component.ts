import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ICountryModel } from '../../../../models/country.model';
import { CountryService } from '../../../../shared/country.service';
import { SectionService } from '../api/section.service';
import { SectionsComponent } from '../sections.component';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {

  @ViewChild('SuccessSwal') private successSwal: SwalComponent;
  @Input() modal: any;

  @Input() countries: Array<ICountryModel> = [];
  addSectionForm: FormGroup

  constructor(private _formBulider: FormBuilder,
    private modalService: NgbModal,
    private _sectionService: SectionService,
    private _sectionComponent: SectionsComponent
  ) { }

  ngOnInit(): void {
    //this.getAllCountries();
    this.addSectionForm = this._formBulider.group({
      countryId: ["", [Validators.required]],
      sectionName: ["", [Validators.required, Validators.minLength(3)]],
      index: [0]
    })

  }



  add() {
    // addSection(section)
    if (this.addSectionForm.valid) {
      console.log(this.addSectionForm.value)
      this._sectionService.addSection(this.addSectionForm.value).subscribe(res => {
        this.modalService.dismissAll()
        this.successSwal.fire()
        this._sectionComponent.getAllSections()
      })
    }
  }
}
