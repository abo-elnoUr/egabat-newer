import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermessionHelper, RolesEnum, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { StateService } from 'src/app/helpers/services/state.service';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import { IUnit } from 'src/app/helpers/_interfaces/units';
import { SemesterService } from '../semesters/service/semester.service';
import { UnitsService } from './service/units.service';


@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;
  RolesEnum = RolesEnum;
  subjectId: string = "";
  subjectName: string = '';
  semesterId: string | null = null;
  ROLES = RolesEnum;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _unitService: UnitsService,
    private _semesterService: SemesterService,
    private _swalSerive: SweetAlertService,
    private _stateService: StateService

  ) {

    _stateService.currentSubject.subscribe(res => this.subjectName = res);
    this.subjectId = this._activeRoute.snapshot.params['subjectId'];
    var x = this._activeRoute.snapshot.data;

  }

  ngOnInit(): void {
    this.getUnits();
    this.getSemesters();

  }

  listOfUnits: IUnit[] = [];
  getUnits() {
    this._unitService.getUnits({ subjectId: this.subjectId, semesterId: this.semesterId || '' }).subscribe(response => {
      this.listOfUnits = response
    });
  };

  listOfSemesters: ISemester[] = [];
  getSemesters() {
    this._semesterService.getSemesters().subscribe(response => {
      this.listOfSemesters = response;
    })
  }


  toggleActive(unitId: string) {
    this._unitService.activationUnit(unitId).subscribe(response => {
      if (response.statusFlag) {
        return this._swalSerive.activation();
      }
      return this._swalSerive.deActivation();
    })
  }


  deleteUnit(unitId: string) {
    this._unitService.deleteUnit(unitId).subscribe(response => {
      this._swalSerive.deleteSuccess();
      this.getUnits();
    })
  }

  warningDeleting(unitId: string) {
    this._swalSerive.warningDeleting().then(result => {
      if (result.isConfirmed) {
        this.deleteUnit(unitId)
      }
    })
  }
  setUnitName(name: string) {
    this._stateService.setCurrentUnitName(name);


  }
}
