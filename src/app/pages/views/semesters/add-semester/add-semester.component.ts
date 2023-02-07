import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICountryModel } from '../../../../models/country.model';
import { CountryService } from '../../../../shared/country.service';
import { SemesterService } from '../service/semester.service';

@Component({
  selector: 'app-add-semester',
  templateUrl: './add-semester.component.html',
  styleUrls: ['./add-semester.component.scss']
})
export class AddSemesterComponent implements OnInit {


  createSemesterForm: FormGroup;
countries:Array<ICountryModel>=[];
  constructor(
    private _route: Router,
    private _semesterService: SemesterService,
    private _formBuilder: FormBuilder,
    private countryService:CountryService
  ) {
    this.createSemesterForm = this._formBuilder.group({
      "countryId":['',[Validators.required]],
      "semesterName": ["", [Validators.required]],
      "startDate": ["", [Validators.required]],
      "endDate": ["", [Validators.required]],
      "index": [0, [Validators.required]]
    })

  }
  getAllCountries()
  {
    this.countryService.getAllCountries().subscribe(res=>this.countries=res);
  }
  ngOnInit(): void {
    this.getAllCountries();
  }

  isSubmiting: boolean = false;
  submit() {
    if (this.createSemesterForm.valid) {
      this.isSubmiting = true;
      this._semesterService.createSemester(this.createSemesterForm.value).subscribe(response => {
        this.isSubmiting = false;
        this._route.navigate(['/Admin/dashboard/semesters'])
      })
    }
  }

}
