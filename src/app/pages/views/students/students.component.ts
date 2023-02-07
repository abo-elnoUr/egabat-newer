import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IStudent, IStudentsObject } from 'src/app/helpers/_interfaces/student';
import { StudentAPIService } from './API/student-api.service';
import { environment } from 'src/environments/environment';

const env = environment
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { SectionService } from '../sections/api/section.service';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';



@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  get RolesEnum(): typeof RolesEnum {
    return RolesEnum
  }

  @ViewChild('SuccessActive') private successSwalActive: SwalComponent;
  @ViewChild('SuccessInActive') private successSwalinActive: SwalComponent;

  listOfStages: Array<IStage>;
  listOfGrades: Array<IGrade>;
  listOfStudents: IStudentsObject = {
    students: [], rowCount: 0
  };
  toggleActiveStudentStaus: Boolean;

  listOfSections: ISection[] = []
  StudentId: string;
  closeResult = '';
  sectionId: string = "";
  page = 1;
  pageSize = 20

  filterStudentsForm: FormGroup;
  pagination = {
    "pageSize": 20,
    "pageNo": 1
  }
  constructor(
    private HttpMethods: StudentAPIService,
    private modalService: NgbModal,
    private _sectionsService: SectionService,
    private _formBuilder: FormBuilder
  ) {
    this.filterStudentsForm = this._formBuilder.group({
      "name": "",
      "mobile": "",
      "sectionId": [null],
      "stageId": [null],
      "gradeId": [null],
      // "subjectId": [null],
      "isActive": null
    })
  }


  ngOnInit(): void {
    document.title = `${env.webSiteName} | الطلاب`

    this.getAllStudents();
    this.getAllStages();
    this.getAllSections()
  }

  getAllStudents() {
    let filter = { ...this.filterStudentsForm.value, ...this.pagination };
    this.HttpMethods.getStudentsByFilter(filter).subscribe(res => {
      this.listOfStudents = res;
    })
  }

  getAllSections() {
    this._sectionsService.getAllSections().subscribe(res => {
      this.listOfSections = res
    })
  }


  getAllStages() {
    this.HttpMethods.getAllStages().subscribe(res => {
      this.listOfStages = res
    })
  }



  getGradesByStageId(stageId: string) {
    this.HttpMethods.getGradesByStageId(stageId).subscribe(response => {
      this.listOfGrades = response
    })
  }

  toggleStudentActive(id: string) {
    this.HttpMethods.toggleStudentActive(id).subscribe(res => {
      if (res.statusFlag) {
        // this.getAllStudents()
        this.successSwalActive.fire()
      } else {
        // this.getAllStudents()
        this.successSwalinActive.fire()
      }
    })
  }


  toggleStudenPremium(studentId: string) {
    this.HttpMethods.toggleStudenPremium(studentId).subscribe((res: any) => {
      if (res.statusFlag) {
        // this.getAllStudents()
        this.successSwalActive.fire()
      } else {
        // this.getAllStudents()
        this.successSwalinActive.fire()
      }
    })
  }

  paginationStudents(pageNo: number) {
    this.HttpMethods.paginationStudents(pageNo, this.pageSize).subscribe(res => {
      this.listOfStudents = res;
      // this.filterStatus = false;
    });
  }



  open(content: any, StudentId: string, sectionId?: string) {
    this.StudentId = StudentId;
    this.sectionId = sectionId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
}
