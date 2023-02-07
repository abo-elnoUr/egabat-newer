import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SemesterService } from '../../semesters/service/semester.service';
import { SectionService } from "../../sections/api/section.service";
import { GradesService } from "../../grades/API/grades.service";
import { SubjectService } from "../../subjects/Api/api-http.service";
import { StageHttpService } from "../../stages/API/stages-http.service";
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
import { UnitsService } from "../service/units.service";
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { RolesEnum } from '../../../../helpers/enums/roles-enum';
@Component({
  selector: 'app-edit-unit',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.scss']
})
export class EditUnitComponent implements OnInit {

  unitId: string = "";
  subjectId: string = "";
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;
  ROLES = RolesEnum;
  updateUnitForm: FormGroup;
  listOfStages: IStage[] = [];
  listOfGrades: IGrade[] = []
  listOfSections: ISection[] = [];
  listOfSubjects: ISubject[] = [];

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
    this.updateUnitForm = this._formBuilder.group({
      sectionId: "",
      stageId: "",
      gradeId: "",
      //
      "unitId": [''],
      "subjectId": [''],
      "semesterId": "",
      "unitName": "",
      "index": 0
    });

    this.unitId = this._activeRoute.snapshot.params['unitId'];
    this.subjectId = this._activeRoute.snapshot.params['subjectId'];
    this.updateUnitForm.get("unitId")?.setValue(this.unitId)
    this.updateUnitForm.get("subjectId")?.setValue(this.subjectId);
    console.log(this._activeRoute.snapshot.params)
  }


  listOfSemesters: ISemester[] = [];
  getSemesters() {
    this._semesterService.getSemesters().subscribe(response => {
      this.listOfSemesters = response;
    });
  };

  getSections() {
    this._sectionService.getAllSections().subscribe(response => {
      this.listOfSections = response;
    });
  };

  getUnitData() {
    this._unitService.getUnitById(this.unitId).subscribe(response => {
      this.updateUnitForm.get("subjectId")?.setValue(response.subjectId);
      this.updateUnitForm.get("semesterId")?.setValue(response.semesterId);
      this.updateUnitForm.get("unitName")?.setValue(response.unitName);
      this.updateUnitForm.get("index")?.setValue(response.index);
    })
  }

  getSubjectData() {
    this._subjectService.getSubjectById(this.subjectId).subscribe(response => {
      console.log("Subject Data", response)
      this.updateUnitForm.get("sectionId")?.setValue(response.sectionId);
      this.updateUnitForm.get("stageId")?.setValue(response.stageId);
      this.updateUnitForm.get("gradeId")?.setValue(response.gradeId);
      this.getGrades();
      this.getSubjectsBySectionAndGrade();
    })
  };

  getGrades() {
    let stageId = this.updateUnitForm.get("stageId")?.value;
    this._gradeService.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response;
      console.log(response)
    })
  }

  getSubjectsBySectionAndGrade() {
    const sectionId = this.updateUnitForm.get("sectionId")?.value;
    const gradeId = this.updateUnitForm.get("gradeId")?.value;
    if (sectionId && gradeId) {
      this._subjectService.getSubjectBySectionAndGrade(sectionId, gradeId).subscribe(response => {
        this.listOfSubjects = response;
      })
    }
  }


  changeStageAndGetGrades() {
    this.getGrades();
    this.updateUnitForm.get("gradeId")?.reset();
    this.updateUnitForm.get("subjectId")?.reset();

  }

  changeGradeAndGetSubjects() {
    this.getSubjectsBySectionAndGrade();
    this.updateUnitForm.get("subjectId")?.reset();
  }


  getStages() {
    this._stageService.getAllStages().subscribe(response => {
      this.listOfStages = response;
    })
  }

  ngOnInit(): void {
    this.getSubjectData();
    this.getUnitData();
    this.getSections();
    this.getStages();
    this.getSemesters();

  };

  disableDependencyForm() {
    this.updateUnitForm.get("sectionId")?.disable();
    this.updateUnitForm.get("stageId")?.disable();
    this.updateUnitForm.get("gradeId")?.disable();
  }

  isSubmiting: boolean = false;
  submit() {
    if (this.updateUnitForm.valid) {
      this.disableDependencyForm();
      this.isSubmiting = true;
      this._unitService.editUnit(this.updateUnitForm?.value).subscribe(response => {
        this.isSubmiting = false;
        this._route.navigate([`/Admin/dashboard/subjects/${this.subjectId}/units`]);
        this._swalService.updateSuccess();
      })
    }
  }


}
