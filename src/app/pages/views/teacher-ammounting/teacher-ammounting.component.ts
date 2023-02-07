import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ISubject, ISubjectFilterResponse } from 'src/app/helpers/_interfaces/subject';
import { ITeacher, ITeachersResponse } from 'src/app/helpers/_interfaces/teacher';
import { GradesService } from '../grades/API/grades.service';
import { StageHttpService } from '../stages/API/stages-http.service';
import { TeachersApiService } from '../teachers/API/teachers-api.service';
import { TeacherAmmountService } from './API/teacher-ammounting.service';
import { ITeacherAmmounting } from './API/teacher-ammounting.service';
import { SubjectService } from "../subjects/Api/api-http.service";
import { SectionService } from '../sections/api/section.service';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGradesGetAll } from 'src/app/models/grades.model';
@Component({
  selector: 'app-teacher-ammounting',
  templateUrl: './teacher-ammounting.component.html',
  styleUrls: ['./teacher-ammounting.component.scss']
})
export class TeacherAmmountingComponent implements OnInit {


  teacherRequestsReport: ITeacherAmmounting;
  filterForm: FormGroup;

  isFiltered: boolean = false;


  constructor(
    private teacherAmmountService: TeacherAmmountService,
    private teachersService: TeachersApiService,
    private StagesService: StageHttpService,
    private GradeService: GradesService,
    private SubjectService: SubjectService,
    private SectionService: SectionService,
    private _form_builder: FormBuilder

  ) {
    this.filterForm = this._form_builder.group({
      "teacherId": [null, [Validators.required]],
      "sectionId": [null],
      "stageId": [null],
      "gradeId": [null],
      "subjectId": [null],
      "dateFrom": [null],
      "dateTo": [null],
    })
  }


  resetForm = () => {

  };

  ngOnInit(): void {
    this.getTeachers();
    this.getSections();
    this.getStages();
  }

  listOfTeachers: ITeachersResponse = {
    rowCount: 0,
    teachers: []
  }
  getTeachers() {
    this.teachersService.getTeachers({ pageSize: 1000, pageNo: 1 }).subscribe(response => {
      this.listOfTeachers = response
    });
  };

  listOfSections: Array<ISection> = []
  getSections() {
    this.SectionService.getAllSections().subscribe(response => {
      this.listOfSections = response
    });
  };

  listOfStages: Array<IStage> = [];
  getStages() {
    this.StagesService.getAllStages().subscribe(response => {
      this.listOfStages = response
    });
  };

  gradesList: IGrade[];
  getGrades() {
    const stageId = this.filterForm.get("stageId")?.value;
    if (stageId) {
      this.GradeService.getGradesByStageId(stageId).subscribe(response => {
        console.log("Grades", response)
        this.gradesList = response
      })
    }
  }

  listOfSubjects: ISubjectFilterResponse = {
    rowCount: 0,
    subjects: []
  }
  getSubjects() {
    let gradeId = this.filterForm.get("gradeId")?.value;
    let sectionId = this.filterForm.get("sectionId")?.value;
    if (gradeId && sectionId) {
      this.SubjectService.getSubjectsByGradeId({ sectionId, gradeId }).subscribe(response => {
        this.listOfSubjects = response;
      })
    }
  }


  submit() {
    console.log(this.filterForm.value);
    if (this.filterForm.valid) {
      this.teacherAmmountService.filterTeacherReports(this.filterForm.value).subscribe(response => {
        console.log(response);
        this.teacherRequestsReport = response;
        this.isFiltered = true
      })
    }
  }


}
