import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import {
  ISubject,
  ISubjectFilterResponse,
} from 'src/app/helpers/_interfaces/subject';
import {
  ITeacher,
  ITeachersResponse,
} from 'src/app/helpers/_interfaces/teacher';
import { TeachersApiService } from './API/teachers-api.service';
import { environment } from 'src/environments/environment';

const env = environment;
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SectionService } from '../sections/api/section.service';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { GradesService } from '../grades/API/grades.service';
import { SubjectService } from '../subjects/Api/api-http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IGradesGetAll } from 'src/app/models/grades.model';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  @ViewChild('SuccessSwal') private successSwal!: SwalComponent;
  @ViewChild('ConfirmDelete') private ConfirmDelete!: SwalComponent;
  @ViewChild('SuccessActive') private SuccessActive!: SwalComponent;
  @ViewChild('SuccessInActive') private SuccessInActive!: SwalComponent;

  teachersData: ITeachersResponse = {
    rowCount: 0,
    teachers: [],
  };

  listOfStages: Array<IStage> = [];
  listOfGrade: IGradesGetAll = {
    grades: [],
    rowCount: 0,
  };
  listOfSubjects: ISubjectFilterResponse = {
    rowCount: 0,
    subjects: [],
  };
  listOfSections: Array<ISection> = [];
  stageId: string = '';
  subjectId: string = '';

  toggleActiveTeacherName: string = '';

  editingTeacherId: string = '';

  deleteTeacherId: string = '';
  deleteTeacherName: string = '';

  closeResult = '';
  // {
  //   "satageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //   "grageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  //   "subjectId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  // }
  filterTeacherForm: FormGroup;
  pagination = {
    pageSize: 20,
    pageNo: 1,
  };
  constructor(
    private HttpMethods: TeachersApiService,
    private modalService: NgbModal,
    private _gradeService: GradesService,
    private _formBuilder: FormBuilder
  ) {
    this.filterTeacherForm = this._formBuilder.group({
      name: [''],
      mobile: [''],
      stageId: [null],
      gradeId: [null],
      subjectId: [null],
      isActive: null,
    });
  }

  gradesList: IGrade[] = [];
  getGradeByStageId(stageId: string) {
    this.filterTeacherForm.patchValue({ gradeId: null });
    this._gradeService.getGradesByStageId(stageId).subscribe((response) => {
      // console.log('Grades', response);
      this.gradesList = response;
    });
  }
  getSubjectByGradeId(gradeId: string) {
    this.filterTeacherForm.patchValue({ subjectId: null });
    this.HttpMethods.getSubjectByGradeId({
      gradeId,
      pageSize: 1000,
      pageNo: 1,
    }).subscribe((response) => {
      this.listOfSubjects = response;
    });
  }

  ngOnInit(): void {
    document.title = `${env.webSiteName} | المعلمين`;
    this.getTeachers();
    this.getSages();
  }

  // Get All Stages
  getSages() {
    this.HttpMethods.getStages().subscribe((res) => {
      this.listOfStages = res;
    });
  }

  // Get Teachers Function ,, Take Filtering Object Or Empty Object To Get All Teachers
  isLoading: boolean = false;
  getTeachers() {
    let filter = { ...this.filterTeacherForm.value, ...this.pagination };
    let stageId: string = this.filterTeacherForm.get('stageId')?.value;
    let gradeId: string = this.filterTeacherForm.get('gradeId')?.value;
    this.isLoading = true;
    this.HttpMethods.getTeachers(filter).subscribe((res) => {
      // console.log('Teachers REs', res);

      this.teachersData = res;
      this.isLoading = false;
      // console.log(this.teachersData);
    });

    // if (stageId) this.getGradeByStageId(stageId);

    // if (gradeId) this.getSubjectByGradeId(gradeId);
  }

  openChangePasswordModal(content: any, id: string) {
    this.editingTeacherId = id;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );

    // alert(`Identity Id is ${id}`)
  }

  rmeoveTeacher(id: string, name: string) {
    // alert(` Teacher Id Id ${id} `)
    this.deleteTeacherId = id;
    this.deleteTeacherName = name;
    setTimeout(() => this.ConfirmDelete.fire(), 0);
  }
  deleteTeacher() {
    this.HttpMethods.deleteTeacher(this.deleteTeacherId).subscribe((res) => {
      this.modalService.dismissAll();
      this.successSwal.fire();
      this.getTeachers();
    });
  }
  cancelDeleteTeacher() {
    this.deleteTeacherId = '';
    this.deleteTeacherName = '';
  }

  toggleActiveTeacher(id: string, name: string) {
    this.toggleActiveTeacherName = name;

    this.HttpMethods.toggleActiveTeacher(id).subscribe((res) => {
      res.statusFlag ? this.SuccessActive.fire() : this.SuccessInActive.fire();
    });
  }

  openAddModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
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

  openEditProfileModal(content: any, teacherId: string) {
    this.editingTeacherId = teacherId;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openEditSubjectsModal(content: any, teacherId: string) {
    this.editingTeacherId = teacherId;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
}
