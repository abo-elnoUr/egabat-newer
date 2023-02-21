import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from 'src/app/helpers/services/state.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ICountryModel } from 'src/app/models/country.model';
import { IGrade } from 'src/app/models/grades.model';
import { IQuestionBankResponse } from 'src/app/models/questions-bank';
import { ISection } from 'src/app/models/sections.model';
import { CountryService } from 'src/app/shared/country.service';
import { SectionService } from '../sections/api/section.service';
import { SubjectService } from '../subjects/Api/api-http.service';
import { QuestionsBankService } from './questions-bank.service';

@Component({
  selector: 'app-question-bank',
  templateUrl: './question-bank.component.html',
  styleUrls: ['./question-bank.component.scss'],
})
export class QuestionBankComponent implements OnInit {
  constructor(
    private countryService: CountryService,
    private sectionService: SectionService,
    private HttpMethods: SubjectService,
    private _formBuilder: FormBuilder,
    private service: QuestionsBankService,
    private _router: Router,
    private _activatdRoute: ActivatedRoute,
    private _swal: SweetAlertService,
    private _stateService: StateService
  ) {
    this.subjectId = _activatdRoute.snapshot.params['subjectId'];
    this.filterForm = this._formBuilder.group({
      name: [''],
      gradeId: [null],
      sectionId: [null],
      stageId: [null],
      isActive: null,
      countryId: [null],
      subjectId: [this.subjectId],
    });
  }

  pagination = {
    pageSize: 20,
    pageNo: 1,
  };

  questions: IQuestionBankResponse = { count: 0, questions: [] };

  isLoading: boolean;
  countries: Array<ICountryModel> = [];
  listOfSections: Array<ISection> = [];
  listOfGrades: Array<IGrade> = [];
  listOfStages: Array<IStage> = [];
  subjectName: string = '';
  subjectId: string;
  filterForm: FormGroup;
  ngOnInit(): void {
    this._stateService.currentSubject.subscribe(
      (res) => (this.subjectName = res)
    );
    this.getAllCountries();
    this.filtrationSubjects();
  }
  Add() {
    this._router.navigate([
      `Admin/dashboard/subjects/${this.subjectId}/questions-bank/create`,
    ]);
  }

  getAllCountries() {
    this.countryService
      .getAllCountries()
      .subscribe((res) => (this.countries = res));
  }
  filterStagesAndGradesByCountry(countryId: string, fromtable = true) {
    if (!countryId || !countryId.length) {
      this.listOfStages = [] = this.listOfSections = [];
      return;
    }
    this.HttpMethods.getAllStages(countryId).subscribe((res) => {
      let result: any = res;
      this.listOfStages = result;
    });
    this.sectionService
      .getAllSections(countryId)
      .subscribe((res) => (this.listOfSections = res));
    if (fromtable) this.filtrationSubjects();
  }
  filtrationSubjects() {
    let filter = { ...this.filterForm.value, ...this.pagination };
    // console.log('Filter', filter);
    let stageId = this.filterForm.get('stageId')?.value;
    // console.log('Stage ID', stageId);
    this.isLoading = true;
    this.service.getQuestions(filter).subscribe((response) => {
      this.isLoading = false;
      this.questions = response;
    });
    if (stageId) this.getGradesByStageId(stageId);
  }
  getGradesByStageId(stageId: string) {
    this.HttpMethods.getGradesByStageId(stageId).subscribe((res) => {
      let result: any = res;
      //this.listOfGradesByStageId = result;
      this.listOfGrades = result;
    });
  }

  delete(unitId: string) {
    this.service.delete(unitId).subscribe((response) => {
      this._swal.deleteSuccess();
      this.filtrationSubjects();
    });
  }

  warningDeleting(id: string) {
    this._swal.warningDeleting().then((result) => {
      if (result.isConfirmed) {
        this.delete(id);
      }
    });
  }
  edit(id: string) {
    this._router.navigateByUrl(`Admin/dashboard/subjects/${this.subjectId}/questions-bank/create/${id}`);
  }
}
