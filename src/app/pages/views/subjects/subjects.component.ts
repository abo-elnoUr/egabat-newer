import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import {
  CreateSubjectDto,
  IEditSubject,
  ISubject,
  ISubjectFilterResponse,
} from 'src/app/helpers/_interfaces/subject';
import { SubjectService } from './Api/api-http.service';

import { environment } from '../../../../environments/environment';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { SectionService } from '../sections/api/section.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ESectionsID } from 'src/app/helpers/enums/sections-ids';
import { StateService } from 'src/app/helpers/services/state.service';
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';
import { ICountryModel } from '../../../models/country.model';
import { CountryService } from '../../../shared/country.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { AddSubjectComponent } from './add-subject/add-subject.component';

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

  editSubjectForm: FormGroup

  listOfSubjects: Array<ISubject>;
  listOfGrades: Array<IGrade>;
  listOfStages: Array<IStage>;
  listGradesByStageId: Array<IGrade>;
  country: ''

  listOfGradesByStageId: Array<IGrade> = [];

  stageId: string;
  sectionId: string = '';
  gradeId: string = '';
  closeResult = '';

  deleteSubjectId = '';
  listOfSections: Array<ISection> = [];

  pagination = {
    pageSize: 20,
    pageNo: 1,
  };

  filterSubjectsForm: FormGroup;
  isLoading: boolean = false
  countries$ = this._CountryService.countries$

  constructor(
    private HttpMethods: SubjectService,
    private modalService: NgbModal,
    private _sectionService: SectionService,
    private _formBuilder: FormBuilder,
    private _stateService: StateService,
    private _CountryService: CountryService,
    private _SweetAlertService: SweetAlertService,
    private _NgbModal: NgbModal,
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

  ngOnInit(): void {
    document.title = `${environment.webSiteName} | المواد`;
    this.createEditSubjectForm()
    this.filtrationSubjects();
  }



  createEditSubjectForm() {
    this.editSubjectForm = new FormGroup({
      subjectId: new FormControl(null, Validators.required),
      gradeId: new FormControl(null, Validators.required),
      stageId: new FormControl(null, Validators.required),
      subjectName: new FormControl('', Validators.required),
      sectionId: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      subjectImage: new FormControl(null),
      isActive: new FormControl(null),
      index: new FormControl(0),
    })
  }

  newSubject = {
    sectionId: '',
    stageId: '',
    gradeId: '',
    subjectName: '',
    index: 0,
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

  openAddSubject(){
    this._NgbModal.open(AddSubjectComponent, { centered: true })
  }



  filtrationSubjects() {
    let filter = { ...this.filterSubjectsForm.value, ...this.pagination };
    let stageId = this.filterSubjectsForm.get('stageId')?.value;
    this.isLoading = true;
    this.HttpMethods.filtrationSubjects(filter).subscribe((response) => {
      this.isLoading = false;
      this.subjectsData = response;
    });
    if (stageId) this.getGradesByStageId(stageId);
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
  getGradesByStageId(stageId: IStage) {
    if(stageId){
      // this.editSubjectForm.get('gradeId').reset()
      this.HttpMethods.getGradesByStageId(stageId.stageId).subscribe((res) => {
        let result: any = res;
        this.listOfGradesByStageId = result;
        this.listOfGrades = result;
      })
    }
  }
  resetGradeId() {
    this.editSubjectForm.get('gradeId').reset()
  }
  imageSubject: string
  // Get Subject By Id
  getSubjectById(subjectId: string) {
    this.HttpMethods.getSubjectById(subjectId).subscribe((res) => {
      let result: any = res
      this.country = result.country,
      this.filterStagesAndGradesByCountry(result.country, false);
      this.editSubjectForm.patchValue({
        subjectId: result.subjectId,
        gradeId: result.gradeId,
        stageId: result.stageId,
        subjectName: result.subjectName,
        country: result.country,
        sectionId: result.sectionId,
        isActive: result.isActive,
        subjectImage: result.subjectImage,
        index: result.index,
      })
      this.imageSubject = result.subjectImage
      console.log(result.subjectImage);

      this.getGradesByStageId(result)

    });
  }

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
    this.editSubjectForm.get('subjectImage').setValue(files[0])
  }

  previewFile() {
    window.open(window.URL.createObjectURL(this.subjectImage));
  }



  // Edit Subject
  editSubject() {
    let fd = new FormData();
    fd.append('SectionId', this.editSubjectForm.get('sectionId').value);
    fd.append('GradeId', this.editSubjectForm.get('gradeId').value);
    fd.append('SubjectName', this.editSubjectForm.get('subjectName').value);
    fd.append('SubjectId', this.editSubjectForm.get('subjectId').value);
    fd.append('SubjectImage', this.editSubjectForm.get('subjectImage').value);
    fd.append('Index', this.editSubjectForm.get('index').value);

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
