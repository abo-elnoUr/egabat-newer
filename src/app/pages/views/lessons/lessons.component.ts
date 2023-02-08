import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { StateService } from 'src/app/helpers/services/state.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ILesson } from 'src/app/helpers/_interfaces/lesson';
import { LessonsService } from './service/lessons.service';
import { RolesEnum } from '../../../helpers/enums/roles-enum'

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;

  unitId: string = "";
  subjectId: string = '';
  subjectName: string = '';
  unitName: string;
  ROLES = RolesEnum;
  constructor(
    private _lessonService: LessonsService,
    private _activeRoute: ActivatedRoute,
    private _swalSerive: SweetAlertService,
    private _stateService: StateService

  ) {
    this.unitId = this._activeRoute.snapshot.params['unitId'];
    this.subjectId = this._activeRoute.snapshot.params['subjectId'];
    //console.log('Subject', this.subjectId);
  }
  getUnitsUrl() {
    //return/Admin/dashboard/subjects/{{subjectId}}}}/units
  }

  listOfLesson: ILesson[] = [];

  ngOnInit(): void {
    this.getLessons();
    this._stateService.currentUnit.subscribe(z => this.unitName = z);
    this._stateService.currentSubject.subscribe(z => this.subjectName = z);

  }

  getLessons() {
    this._lessonService.getLessons(this.unitId).subscribe(response => {
      this.listOfLesson = response;
    })
  }
  setLessonName(lessonName: string) {
    this._stateService.setCurrentLessonName(lessonName);
  }

  toggleActive(unitId: string) {
    this._lessonService.activationLesson(unitId).subscribe(response => {
      if (response.statusFlag) {
        return this._swalSerive.activation();
      }
      return this._swalSerive.deActivation();
    })
  }


  deleteLesson(unitId: string) {
    this._lessonService.deleteLesson(unitId).subscribe(response => {
      this._swalSerive.deleteSuccess();
      this.getLessons();
    })
  }

  warningDeleting(unitId: string) {
    this._swalSerive.warningDeleting().then(result => {
      if (result.isConfirmed) {
        this.deleteLesson(unitId)
      }
    })
  }

}
