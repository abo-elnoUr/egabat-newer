import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
import { IPermession, ISubjectPermession } from 'src/app/models/subject-permession.model';
import { ICountryModel } from '../../../../../models/country.model';
import { CountryService } from '../../../../../shared/country.service';
import { SectionService } from '../../../sections/api/section.service';
import { TeachersApiService } from '../../API/teachers-api.service';
import { TeachersComponent } from '../../teachers.component';

interface TeacherSubject {
  subjectName: string
  subjectId: string
}

@Component({
  selector: 'app-create-teacher-modal',
  templateUrl: './create-teacher-modal.component.html',
  styleUrls: ['./create-teacher-modal.component.scss']
})
export class CreateTeacherModalComponent implements OnInit {

  @Input() modal: any;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;

  countries: Array<ICountryModel> = [];
  listOfStages: Array<IStage>;
  listOfGrade: Array<IGrade>;
  listOfSubjects: Array<any>;
  permessions: ISubjectPermession[] = [];

  subjectId: string;
  sectionId: string;
  listOfSections: Array<ISection> = [];



  TeacherData: any = {
    "name": "",
    "mobile": "",
    "email": "",
    "password": "",
    "subjects": [

    ]


  }

  teacherSubjectsView: Array<any> = [];


  constructor(
    private HttpMethods: TeachersApiService,
    private modalService: NgbModal,
    private teahcerMethods: TeachersComponent,
    private _sectionService: SectionService,
    private countryService: CountryService) { }


  ngOnInit(): void {
    // this.getSages();
    // this.getAllSections()
    this.getAllCountries();
  }

  filterByCountry(countryId: string) {
    this.HttpMethods.getStages(countryId).subscribe(res => {
      let result: any = res;
      this.listOfStages = result

    });
    this._sectionService.getAllSections(countryId).subscribe(
      res => {
        this.listOfSections = res
      }
    )
  }
  getAllCountries() {
    this.countryService.getAllCountries().subscribe(res => this.countries = res);
  }
  getPermessionsForView(subject: any): string {
    var permessions: Array<string> = [];
    for (let per of subject.permessions) {
      permessions.push(per.displayName);
    }
    return permessions.join(',');

  }
  getSelectedPermessions(): Array<any> {
    let selectedPermessions: Array<any> = [];
    for (let permession of this.permessions) {
      const current = permession;
      for (let per of current.permessions) {
        var _per: any = {
          displayName: `${permession.displayName} - ${per.displayName}`,
          isSelected: per.isSelected,
          permession: per.permession
        }

        if (per.isSelected)
          selectedPermessions.push(_per);
      }

    }
    return selectedPermessions;
  }

  getAllSections() {
    this._sectionService.getAllSections().subscribe(
      res => {
        this.listOfSections = res
      }
    )
  }

  getPermissions() {
    this.HttpMethods.getSubjectPermessions().subscribe(res => { this.permessions = res; console.log('res', res) });
    console.log(this.permessions);
  }


  getSages() {
    this.HttpMethods.getStages().subscribe(res => {
      let result: any = res;
      this.listOfStages = result

    })
  }
  getGradesByStageId(stageId: string) {
    this.listOfGrade = []
    this.listOfSubjects = []
    this.HttpMethods.getGradeByStageId(stageId).subscribe(res => {
      let result: any = res;
      this.listOfGrade = result

    })
  }
  getSubjectsByGradeId(gradeId: string) {
    this.listOfSubjects = []

    console.log("SECTION ID", this.sectionId)

    this.HttpMethods.getSubjectByGradeId({ gradeId, sectionId: this.sectionId }).subscribe(res => {
      this.listOfSubjects = res.subjects
      if (!this.permessions.length)
        this.getPermissions();
    })
  }


  addSubjectToListOfTeahcer() {

    for (let subject of this.listOfSubjects) {
      if (subject.subjectId === this.subjectId) {
        let teacherSubjs = this.TeacherData.subjects;
        let selectedPermessions = this.getSelectedPermessions();

        teacherSubjs.push(
          {
            subjectId: subject.subjectId, permessions: selectedPermessions
          }
        )

        let removeDubs = new Set(teacherSubjs);

        this.TeacherData.subjects = [...removeDubs]



        let teacherSubjsView = this.teacherSubjectsView;
        subject.permessions = selectedPermessions;
        teacherSubjsView.push(subject);


        let rDubs = new Set(teacherSubjsView);

        this.teacherSubjectsView = [...rDubs]

      }
    }
    console.log('Teacher', this.TeacherData);
    console.log('Teacher', this.teacherSubjectsView);
  }


  createNewTeacher() {
    console.log("Teacher Data", this.TeacherData)
    console.log("Teacher Subjects View", this.teacherSubjectsView)

    let teacherData = this.TeacherData;

    if (
      teacherData.name &&
      teacherData.email &&
      teacherData.mobile &&
      teacherData.password
    ) {
      console.log('sucess enter')

      let submitModel: any =
      {
        "name": teacherData.name,
        "mobile": teacherData.mobile,
        "email": teacherData.email,
        "password": teacherData.password,
        "subjects": []

      }
      for (let subject of teacherData.subjects) {
        let obj: any = { "subjectId": subject.subjectId, "permessions": [] }

        for (let permession of subject.permessions) {
          obj.permessions.push(permession.permession);
        }
        submitModel.subjects.push(obj);
      }
      console.log('sumbit ', submitModel);

      this.HttpMethods.createTeacher(submitModel).subscribe(res => {
        this.modalService.dismissAll()
        this.successSwal.fire()
        this.teahcerMethods.getTeachers()
      })
    }



  }

}
