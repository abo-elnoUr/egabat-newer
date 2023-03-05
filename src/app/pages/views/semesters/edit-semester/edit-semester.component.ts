import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICountryModel } from '../../../../models/country.model';
import { CountryService } from '../../../../shared/country.service';
import { SemesterService } from '../service/semester.service';

@Component({
  selector: 'app-edit-semester',
  templateUrl: './edit-semester.component.html',
  styleUrls: ['./edit-semester.component.scss']
})
export class EditSemesterComponent implements OnInit {
  semesterId: string = "";

  updateSemsterForm: FormGroup;

  countries$ = this._CountryService.countries$
  constructor(
    private _activeRoute: ActivatedRoute,
    private _route: Router,
    private _semesterService: SemesterService,
    private _formBuilder: FormBuilder,
    private _CountryService: CountryService
  ) {
    this.semesterId = this._activeRoute.snapshot.params['semesterId'];

    this.updateSemsterForm = this._formBuilder.group({
      "countryId": ['', [Validators.required]],
      "semesterId": ["", [Validators.required]],
      "semesterName": ["", [Validators.required]],
      "startDate": ["", [Validators.required]],
      "endDate": ["", [Validators.required]],
      "index": [0, [Validators.required]]
    })

  }

  ngOnInit(): void {
    this.getSemesterData();
  }

  getSemesterData() {

    this._semesterService.getSemesterById(this.semesterId).subscribe(response => {
      console.log(response.startDate);
      console.log(response.endDate);
      this.updateSemsterForm.get("countryId")?.setValue(response.countryId);
      this.updateSemsterForm.get("semesterId")?.setValue(response.semesterId);
      this.updateSemsterForm.get("semesterName")?.setValue(response.semesterName);
      this.updateSemsterForm.get("startDate")?.setValue(formatDate(response.startDate, 'yyyy-MM-dd', 'en'));
      this.updateSemsterForm.get("endDate")?.setValue(formatDate(response.endDate, 'yyyy-MM-dd', 'en'));
      this.updateSemsterForm.get("index")?.setValue(response.index);
    })
  }

  isSubmiting: boolean = false;
  submit() {
    if (this.updateSemsterForm.valid) {
      this.isSubmiting = true;
      this._semesterService.updateSemester(this.updateSemsterForm.value).subscribe(response => {
        this.isSubmiting = false;
        this._route.navigate(['/Admin/dashboard/semesters'])
      })
    }
  }

}
