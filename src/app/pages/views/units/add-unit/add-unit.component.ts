import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISection } from 'src/app/models/sections.model';
import { RolesEnum } from '../../../../helpers/enums/roles-enum';
import { GradesService } from '../../grades/API/grades.service';
import { SectionService } from '../../sections/api/section.service';
import { SemesterService } from '../../semesters/service/semester.service';
import { StageHttpService } from '../../stages/API/stages-http.service';
import { SubjectService } from '../../subjects/Api/api-http.service';
import { UnitsService } from '../service/units.service';
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';

@Component({
  selector: 'app-add-unit',
  templateUrl: './add-unit.component.html',
  styleUrls: ['./add-unit.component.scss']
})
export class AddUnitComponent implements OnInit {

  subjectId: string = "";
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;
  createUnitForm: FormGroup;
  ROLES = RolesEnum;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _route: Router,
    private _semesterService: SemesterService,
    private _unitService: UnitsService,
    private _subjectService: SubjectService,
    private _sectionService: SectionService,
    private _gradeService: GradesService,
    private _stageService: StageHttpService,
    private _swalService: SweetAlertService
  ) {
    this.createUnitForm = this._formBuilder.group({

      sectionId: "",
      stageId: "",
      gradeId: "",

      //
      "subjectId": ["", [Validators.required, Validators.minLength(1)]],
      "semesterId": ["", [Validators.required, Validators.minLength(1)]],
      "unitName": ["", [Validators.required, Validators.minLength(1)]],
      "index": [0, [Validators.required, Validators.minLength(1)]],
    });

    this.subjectId = this._activeRoute.snapshot.params['subjectId'];
    this.createUnitForm.get("subjectId")?.setValue(this.subjectId);
    console.log(this._activeRoute.snapshot.params)
  }


  listOfSemesters: ISemester[] = [];
  getSemesters() {
    this._semesterService.getSemesters(this.subjectId).subscribe(response => {
      this.listOfSemesters = response;
    });
  };

  listOfSections: ISection[] = [];
  getSections() {
    this._sectionService.getAllSections().subscribe(response => {
      this.listOfSections = response;
    });
  };

  getSubjectData() {
    this._subjectService.getSubjectById(this.subjectId).subscribe(response => {
      console.log("Subject Data", response)
      this.createUnitForm.get("sectionId")?.setValue(response.sectionId);
      this.createUnitForm.get("subjectId")?.setValue(response.subjectId);
      this.createUnitForm.get("stageId")?.setValue(response.stageId);
      this.createUnitForm.get("gradeId")?.setValue(response.gradeId);
      this.getGrades();
      this.getSubjectsBySectionAndGrade();
    })
  };

  listOfGrades: IGrade[] = []
  getGrades() {
    let stageId: string = this.createUnitForm.get("stageId")?.value;
    this._gradeService.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response;
      console.log(response)
    })
  }

  listOfSubjects: ISubject[] = []
  getSubjectsBySectionAndGrade() {
    const sectionId = this.createUnitForm.get("sectionId")?.value;
    const gradeId = this.createUnitForm.get("gradeId")?.value;
    if (sectionId && gradeId) {
      this._subjectService.getSubjectBySectionAndGrade(sectionId, gradeId).subscribe(response => {
        this.listOfSubjects = response;
      })
    }
  }


  changeStageAndGetGrades() {
    this.getGrades();
    this.createUnitForm.get("gradeId")?.reset();
    this.createUnitForm.get("subjectId")?.reset();

  }

  changeGradeAndGetSubjects() {
    this.getSubjectsBySectionAndGrade();
    this.createUnitForm.get("subjectId")?.reset();
  }


  listOfStages: IStage[] = []
  getStages() {
    this._stageService.getAllStages().subscribe(response => {
      this.listOfStages = response;
    })
  }

  ngOnInit(): void {
    this.getSubjectData();
    this.getSections();
    this.getStages();
    this.getSemesters();

  };

  disableDependencyForm() {
    this.createUnitForm.get("sectionId")?.disable();
    this.createUnitForm.get("stageId")?.disable();
    this.createUnitForm.get("gradeId")?.disable();
  }

  isSubmiting: boolean = false;
  submit() {
    if (this.createUnitForm.valid) {
      this.disableDependencyForm();
      this.isSubmiting = true;
      this._unitService.createUnit(this.createUnitForm.value).subscribe(response => {
        this.isSubmiting = false;
        this._route.navigate([`/Admin/dashboard/subjects/${this.subjectId}/units`]);
        this._swalService.createSuccess();
      })
    }
  }
}
