import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const env = environment
import { RolesEnum } from 'src/app/helpers/enums/roles-enum';
import { IDashboardReport } from 'src/app/helpers/_interfaces/Reports';
import { IRole } from 'src/app/helpers/_interfaces/Roles';
import { ReportsService } from '../reports/API/reports.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  reportData: IDashboardReport = {
    section: 0,
    stage: 0,
    grade: 0,
    subject: 0,
    student: 0,
    teacher: 0,
    request: 0,
    repliedRequest: 0,
    repliedInTimeRequest: 0,
    notRepliedRequest: 0,
  }

  get RolesEnum(): typeof RolesEnum {
    return RolesEnum
  }

  constructor(
    private _reportService: ReportsService
  ) { }

  ngOnInit(): void {
    document.title = `${env.webSiteName} | الرئيسية`;
    this.getDashboardReport();
  }

  getDashboardReport() {
    this._reportService.getDashboardReport().subscribe(response => {
      this.reportData = response;
    })
  }

}
