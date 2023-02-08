import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import {
  IEditSubject,
  ISubject,
  ISubjectFilterResponse,
} from 'src/app/helpers/_interfaces/subject';
import { SubjectService } from './Api/api-http.service';

import { environment } from '../../../../environments/environment';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { SectionService } from '../sections/api/section.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ESectionsID } from 'src/app/helpers/enums/sections-ids';
import { StateService } from 'src/app/helpers/services/state.service';
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';
import { ICountryModel } from '../../../models/country.model';
import { CountryService } from '../../../shared/country.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  RolesEnum = RolesEnum;

  SITE_URL = `${environment.API_ROOT}/`;

  @ViewChild('SuccessSwal') private successSwal: SwalComponent;

  setCurrentSubjectTitle(title: string) {
    this._stateService.setCurrentSubjectName(title);
  }
  get SectionID(): typeof ESectionsID {
    return ESectionsID;
  }

  subjectsData: ISubjectFilterResponse = {
    rowCount: 0,
    subjects: [],
  };

  listOfSubjects: Array<ISubject>;
  listOfGrades: Array<IGrade>;
  listOfStages: Array<IStage>;
  listGradesByStageId: Array<IGrade>;
  countries: Array<ICountryModel> = [];

  listOfGradesByStageId: Array<IGrade> = [];

  stageId: string;
  sectionId: string = '';
  gradeId: string = '';
  closeResult = '';

  deleteSubjectId = '';
  listOfSections: Array<ISection> = [];

  newSubject = {
    sectionId: '',
    stageId: '',
    gradeId: '',
    subjectName: '',
    index: 0,
  };

  editSubjectSnapShotData: ISubject = {
    country: '',
    tempSubjectId: '',
    subjectId: '',
    subjectName: '',
    stageId: '',
    stageName: '',
    gradeId: '',
    gradeName: '',
    sectionName: '',
    sectionId: '',
    isActive: false,
    subjectImage: '',
    index: 0,
    permessions: [],
  };

  upDateSubject: IEditSubject = {
    subjectId: '',
    gradeId: '',
    stageId: '',
    subjectName: '',
    sectionId: '',
    isActive: false,
    subjectImage: '',
    index: 0,
  };
  pagination = {
    pageSize: 20,
    pageNo: 1,
  };
  filterSubjectsForm: FormGroup;

  constructor(
    private HttpMethods: SubjectService,
    private modalService: NgbModal,
    private _sectionService: SectionService,
    private _formBuilder: FormBuilder,
    private _stateService: StateService,
    private countryService: CountryService
  ) {
    this.filterSubjectsForm = this._formBuilder.group({
      name: [''],
      gradeId: [null],
      sectionId: [null],
      stageId: [null],
      isActive: null,
      countryId: [null],
    });
  }

  isLoading: boolean = false;
  getAllCountries() {
    this.countryService
      .getAllCountries()
      .subscribe((res) => (this.countries = res));
  }
  filtrationSubjects() {
    let filter = { ...this.filterSubjectsForm.value, ...this.pagination };
    // console.log('Filter', filter);
    let stageId = this.filterSubjectsForm.get('stageId')?.value;
    // console.log('Stage ID', stageId);
    this.isLoading = true;
    this.HttpMethods.filtrationSubjects(filter).subscribe((response) => {
      this.isLoading = false;
      // console.log('Responsessssssssssubjects', response);
      console.log(response);
      this.subjectsData = response;
    });
    if (stageId) this.getGradesByStageId(stageId);
  }

  ngOnInit(): void {
    document.title = `${environment.webSiteName} | المواد`;
    this.getAllCountries();
    // this.getAllSubjects();
    // this.getAllStages();
    // this.getAllSections();
    this.filtrationSubjects();
  }

  // Get All Subjects
  getAllSubjects() {
    this.HttpMethods.getListOfSubjects().subscribe((res) => {
      let result: any = res;
      this.listOfSubjects = result;
    });
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
    this._sectionService
      .getAllSections(countryId)
      .subscribe((res) => (this.listOfSections = res));
    if (fromtable) this.filtrationSubjects();
  }

  // Get Stages
  getAllStages() {
    this.HttpMethods.getAllStages().subscribe((res) => {
      let result: any = res;
      this.listOfStages = result;
    });
  }

  // Get Grades By Stage Id
  getGradesByStageId(stageId: string) {
    this.HttpMethods.getGradesByStageId(stageId).subscribe((res) => {
      let result: any = res;
      this.listOfGradesByStageId = result;
      this.listOfGrades = result;
    });
  }

  // Get Subject By Id
  getSubjectById(subjectId: string) {
    this.HttpMethods.getSubjectById(subjectId).subscribe((res) => {
      let result: any = res;
      console.log('Subject Data', res);
      this.editSubjectSnapShotData = {
        country: result.country,
        tempSubjectId: result.tempSubjectId,
        subjectId: result.subjectId,
        subjectName: result.subjectName,
        gradeId: result.gradeId,
        gradeName: result.gradeName,
        stageId: result.stageId,
        stageName: result.stageName,
        sectionName: result.sectionName,
        sectionId: result.sectionId,
        isActive: result.isActive,
        subjectImage: res.subjectImage,
        index: result.index,
        permessions: [],
      };

      this.filterStagesAndGradesByCountry(result.country, false);
      this.upDateSubject = {
        subjectId: result.subjectId,
        gradeId: result.gradeId,
        stageId: result.stageId,
        subjectName: result.subjectName,
        sectionId: result.sectionId,
        isActive: result.isActive,
        subjectImage: res.subjectImage,
        index: result.index,
      };
    });
  }
  /**
   *
   *  {
    "sectionId": "dda9956b-ceae-4bcf-8880-121e496826ef",
    * @param gradeId
    "gradeId": "7489b01a-499a-41fd-be11-7c671dc900b3"
}
   */

  // Get Subjects By Grade Id
  getSubjectsByGradeId(gradeId: string) {
    this.gradeId = gradeId;
    const filter = {
      gradeId: gradeId,
      sectionId: this.sectionId,
    };

    this.HttpMethods.getSubjectsByGradeId(filter).subscribe((res) => {
      let result: any = res;

      console.log(result);

      this.listOfSubjects = result;
    });
  }

  selectSection(sectionId: string) {
    this.newSubject.sectionId = sectionId;
  }

  subjectImage: File;
  uploadFile(files: any) {
    this.subjectImage = files[0];
  }

  previewFile() {
    //let  fileItem = this.Files.controls[index] as FormGroup;

    window.open(window.URL.createObjectURL(this.subjectImage));
  }

  collectDataCreateSubject() {
    let fd = new FormData();
    fd.append('SectionId', this.newSubject.sectionId);
    fd.append('GradeId', this.newSubject.gradeId);
    fd.append('SubjectName', this.newSubject.subjectName);
    fd.append('SubjectImage', this.subjectImage);
    fd.append('index', `${this.newSubject.index}`);
    return fd;
  }
  // Create Subject
  createSubject() {
    this.HttpMethods.createSubject(this.collectDataCreateSubject()).subscribe(
      (res) => {
        this.upDateSubjectsTable();
      }
    );
  }

  // Edit Subject
  editSubject() {
    let fd = new FormData();
    fd.append('SectionId', this.upDateSubject.sectionId);
    fd.append('GradeId', this.upDateSubject.gradeId);
    fd.append('SubjectName', this.upDateSubject.subjectName);
    fd.append('SubjectId', this.upDateSubject.subjectId);
    fd.append('SubjectImage', this.subjectImage);
    fd.append('Index', `${this.upDateSubject.index}`);

    this.HttpMethods.editSubject(fd).subscribe((res) => {
      this.upDateSubjectsTable();
    });
  }

  // Delete Subject
  deleteSubject() {
    this.HttpMethods.deleteSubject(this.deleteSubjectId).subscribe((res) => {
      this.upDateSubjectsTable();
    });
  }

  upDateSubjectsTable() {
    this.modalService.dismissAll();
    this.successSwal.fire();
    this.filtrationSubjects();
  }

  getAllSections() {
    this._sectionService.getAllSections().subscribe((res) => {
      this.listOfSections = res;
    });
  }

  openAddModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  open(content: any, subjectId: string) {
    // this.getAllGrades()
    this.getSubjectById(subjectId);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  toggleSubjectActivation(subjectId: string) {
    this.HttpMethods.activation(subjectId).subscribe((response: any) => {
      Swal.fire(
        `عملية ناجحة`,
        ` تم ${response.statusFlag ? '' : 'الغاء'} التفعيل بنجاح `,
        `success`
      );
    });
  }
}
