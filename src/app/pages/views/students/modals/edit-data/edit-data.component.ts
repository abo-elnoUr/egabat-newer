import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGradesGetAll } from 'src/app/models/grades.model';
import { GradesService } from '../../../grades/API/grades.service';
import { SectionService } from '../../../sections/api/section.service';
import { StageHttpService } from '../../../stages/API/stages-http.service';
import { StudentAPIService } from '../../API/student-api.service';




@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss']
})



export class EditStudenProfile implements OnInit {

  studenId: string = "";
  editstudentForm: FormGroup;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _studentService: StudentAPIService,
    private _formBuilder: FormBuilder,
    private _sectionService: SectionService,
    private _stageService: StageHttpService,
    private _gradeService: GradesService
  ) {
    this.editstudentForm = this._formBuilder.group({
      "studentId": ['', [Validators.required]],
      "sectionId": ['', [Validators.required]],
      "stageId": ['', [Validators.required]],
      "gradeId": ['', [Validators.required]],
      "name": ['', [Validators.required]],
      "mobile": ['', [Validators.required]],
      "email": "string",
    })
  }

  ngOnInit() {
    this.studenId = this._activeRoute.snapshot.params['studentId'];
    this.getSections();
    this.getStages();
    this.getStudent();
  }

  listOfSection: ISection[] = [];
  getSections() {
    this._sectionService.getAllSections().subscribe(response => {
      this.listOfSection = response
    })
  };

  listOfStages: IStage[] = [];
  getStages() {
    this._stageService.getAllStages().subscribe(response => {
      this.listOfStages = response;
    })
  }

  listOfGrades: IGrade[] = []
  getGrades(stageId: string) {
    this._gradeService.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response
    })
  }

  isLoading: boolean = false;
  getStudent() {
    this.isLoading = true;
    this._studentService.getStudentById(this.studenId).subscribe((response) => {
      let form = this.editstudentForm;
      form.get("studentId")?.setValue(response.studentId);
      form.get("sectionId")?.setValue(response.sectionId);
      form.get("gradeId")?.setValue(response.gradeId);
      form.get("stageId")?.setValue(response.stageId);
      form.get("name")?.setValue(response.name);
      form.get("mobile")?.setValue(response.mobile);
      form.get("email")?.setValue(response.email);
      this.getGrades(response.stageId);
      this.isLoading = false;
    })
  }

  submited: boolean = false;
  requestStatus: boolean = false;
  submit() {
    this.submited = true;
    this.requestStatus = true;
    this._studentService.edtiStudent(this.editstudentForm.value).subscribe(response => {
      this.requestStatus = false;
      this._router.navigate(["/Admin/dashboard/students"])
    })
  }

}



interface IStudent {
  studentId: string
  ame: string
  mobile: string
  email: string
  studentImage: null
  sectionName: string
  stageName: string
  gradeName: string
  identityId: null
  isActive: boolean
  premiumSubscription: boolean
  "sectionId": string
  "stageId": string
  "gradeId": string
}

