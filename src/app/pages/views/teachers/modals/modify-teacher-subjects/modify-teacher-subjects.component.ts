import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IGrade } from 'src/app/helpers/_interfaces/grade';
import { ISection } from 'src/app/helpers/_interfaces/section';
import { IStage } from 'src/app/helpers/_interfaces/stage';
import { ISubject } from 'src/app/helpers/_interfaces/subject';
import { ITeacherSubjects, IUpdateSubjectPermession, IUpdateTeacherSubjects } from 'src/app/helpers/_interfaces/teacher';
import { IPermession, ISubjectPermession } from 'src/app/models/subject-permession.model';
import Swal from 'sweetalert2';
import { ICountryModel } from '../../../../../models/country.model';
import { CountryService } from '../../../../../shared/country.service';
import { SectionService } from '../../../sections/api/section.service';
import { TeachersApiService } from '../../API/teachers-api.service';
import { TeachersComponent } from '../../teachers.component';

@Component({
  selector: 'app-modify-teacher-subjects',
  templateUrl: './modify-teacher-subjects.component.html',
  styleUrls: ['./modify-teacher-subjects.component.scss']
})
export class ModifyTeacherSubjectsComponent implements OnInit {
  @Input() modal: any;
  @Input() teacherId: string;
  @ViewChild('SuccessSwal') private successSwal: SwalComponent;

  constructor(
    private HttpMethods: TeachersApiService,
    private modalService: NgbModal,
    private teacherMethods: TeachersComponent,
    private _sectionService: SectionService,
    private countryService: CountryService
  ) { }



  countries: Array<ICountryModel> = [];
  listOfStages: Array<IStage>;
  listOfGrade: Array<IGrade>;
  listOfSubjects: Array<ISubject>;
  listOfSections: Array<ISection> = [];
  subjectId: string;
  sectionId: string;
  currentTeacherSubjects: ITeacherSubjects;
  permessions: ISubjectPermession[] = [];
  newTeacherSubjectsId: IUpdateTeacherSubjects

  newTeacherSubjectsView: Array<ISubject> = [];

  isUpdatedPermessions: boolean = false;

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
  modifyPermessions(subject: string, permession: string, status: boolean) {
    // let stat:boolean= status==='on';
    console.log('status', status);
    //  console.log('stat',stat);
    this.HttpMethods.deleteOrAddSubjectPermession(this.teacherId, subject, permession, status).subscribe(res => console.log(res));
  }
  getCurrentPermessionsForView(subject: ISubject, module: string): IPermession[] {
    let data = subject.permessions.filter(a => a.displayName === module)[0];
    return data?.permessions;

  }
  ngOnInit(): void {
    this.getTeacherSubjects(this.teacherId)
    this.getAllCountries();

    // this.getSages()
    // this.getSections()
  }
  getPermessionsForView(subject: any): string {
    if (!subject.permessions)
      return '';
    var permessions: Array<string> = [];
    for (let per of subject?.permessions) {
      permessions.push(per.permession);
    }
    return permessions.join(',');

  }


  getPermessionsForViewNew(subject: any): string {
    var permessions: Array<string> = [];
    for (let per of subject.permessions) {
      permessions.push(per.displayName);
    }
    return permessions.join(',');

  }

  getTeacherSubjects(id: string) {
    this.HttpMethods.getTeacherById(id).subscribe(res => {

      console.log()
      console.log(res);
      this.currentTeacherSubjects = {
        subjects: res.subjects,
      }

      console.log(this.currentTeacherSubjects);
      this.newTeacherSubjectsId = {
        teacherId: res.teacherId,
        updatedPermessions: [],
        subjects: []
      }
      res.subjects?.forEach(subject => {
        let obj: any = { subjectId: subject.subjectId, permessions: [] };
        subject.permessions?.forEach(module => {

          module.permessions?.forEach(_permession => {
            if (_permession.isSelected)
              obj.permessions.push(_permession.permession);
          });

        });
        if (obj.permessions.length)
          this.newTeacherSubjectsId.updatedPermessions.push(obj);
      });
      console.log(this.newTeacherSubjectsId);
    })
  }



  getSections() {
    this._sectionService.getAllSections().subscribe(res => {
      this.listOfSections = res;
    })
  }

  getPermissions() {
    this.HttpMethods.getSubjectPermessions().subscribe(res => { this.permessions = res; console.log('res', res) });
    console.log(this.permessions);
  }


  // Adding Table Methods
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
    this.HttpMethods.getSubjectByGradeId({ gradeId, sectionId: this.sectionId }).subscribe(res => {
      this.listOfSubjects = res.subjects

      if (!this.permessions.length)
        this.getPermissions();
    })
  }

  getSelectedPermessions(): Array<any> {
    let selectedPermessions: Array<any> = [];
    for (let permession of this.permessions) {
      const current = permession;
      for (let per of current.permessions) {
        var _per: IPermession = {
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


  addSubjectToListOfTeahcer() {
    let isExists =
      this.newTeacherSubjectsId?.subjects?.filter(a => a.subjectId == this.subjectId).length > 0 ||
      this.currentTeacherSubjects?.subjects?.filter(a => a.tempSubjectId == this.subjectId).length > 0
      ;
    console.log('is Exisits', isExists)
    console.log('Subject Id', this.subjectId)
    console.log('subjects', this.currentTeacherSubjects.subjects)
    if (isExists) {
      Swal.fire(
        `المادة مكررة`,
        ` المادة مسجلة للمعلم مسبقا ! `,
        `error`
      )
      return;
    }
    for (let subject of this.listOfSubjects) {
      if (subject.subjectId === this.subjectId) {




        let teacherSubjs = this.newTeacherSubjectsId.subjects;


        let selectedPermessions = this.getSelectedPermessions();

        teacherSubjs.push({ subjectId: subject.subjectId, permessions: selectedPermessions })


        let removeDubs = new Set(teacherSubjs);

        this.newTeacherSubjectsId.subjects = [...removeDubs]


        let teacherSubjsView = this.newTeacherSubjectsView;
        console.log(selectedPermessions);
        subject.permessions = selectedPermessions;

        teacherSubjsView.push(subject)



        let rDubs = new Set(teacherSubjsView);

        this.newTeacherSubjectsView = [...rDubs]

      }
    }
  }

  updatPermessions(subjectId: string, permession: string, status: boolean) {
    this.isUpdatedPermessions = true;
    if (!this.newTeacherSubjectsId?.updatedPermessions.length)
      this.newTeacherSubjectsId.updatedPermessions = [];

    let subjectPermession = this.newTeacherSubjectsId.updatedPermessions.filter(a => a.subjectId == subjectId)[0];
    if (subjectPermession) {
      let index = subjectPermession.permessions.findIndex(a => a == permession);
      if (index >= 0 && !status) {
        subjectPermession.permessions.splice(index, 1);
        console.log('subject should be removed', subjectPermession);
      }
      else if (index < 0 && status)
        subjectPermession.permessions.push(permession);
    } else if (!subjectPermession && status) {
      let newSubjectPermession: IUpdateSubjectPermession = { subjectId: subjectId, permessions: [permession] };
      this.newTeacherSubjectsId.updatedPermessions.push(newSubjectPermession);
    }


  }

  editTeacherSubject() {
    console.log("New Teacher Subjects View", this.newTeacherSubjectsView)
    console.log("New Teacher Subjects Data", this.newTeacherSubjectsId)



    let submitModel: any = { teacherId: this.newTeacherSubjectsId.teacherId, subjects: [], updatedPermessions: this.newTeacherSubjectsId.updatedPermessions };
    if (!this.isUpdatedPermessions)
      submitModel.updatedPermessions = null;
    console.log('create Subitmodel')
    this.newTeacherSubjectsId.subjects.forEach(subject => {


      let obj: any = { "subjectId": subject.subjectId, "permessions": [] };

      for (let permession of subject.permessions) {
        obj.permessions.push(permession['permession']);
      }
      submitModel.subjects.push(obj);
    });
    console.log('submitmodel', submitModel);
    this.HttpMethods.editTeacherSubject(submitModel).subscribe(res => {

      this.modalService.dismissAll();

      this.successSwal.fire();
      this.teacherMethods.getTeachers()
    });

  };




  deleteSubjectFromTeacher(subjectId: string) {
    this.HttpMethods.deleteSubjectFromTeacher(subjectId).subscribe(res => {
      this.successSwal.fire();
      this.getTeacherSubjects(this.teacherId)
    })
  }


}
