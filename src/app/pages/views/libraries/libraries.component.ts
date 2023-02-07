import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { LibsCategs } from 'src/app/helpers/enums/libraries-categories.enum';
import { ILibrary } from 'src/app/helpers/_interfaces/library';
import Swal from 'sweetalert2';
import { LibrariesService } from './libraries.service';
import { GradesService } from '../grades/API/grades.service';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {
  SITE_URL = `${environment.API_ROOT}/`;
  // listOfLibraries: ILibrary[] = [];
  listOfLibraries: any[] = [];
  gradeId: string = "";
  libraryId: string = "";

  filter = {
    stageId: '',
    gradeId: '',
    countryId: '',
    // semsterId: ''
  }

  get LibsCategs(): typeof LibsCategs {
    return LibsCategs
  }

  constructor(
    private _libraryService: LibrariesService,
    private _activedRoute: ActivatedRoute,
    private _GradesService: GradesService
  ) {
    this.gradeId = this._activedRoute.snapshot.params['gradeId'];
  }

  ngOnInit(): void {
    // this.getLibraries();
    this.getGradeById(this.gradeId)
  }

  // getLibraries() {
  //   this._libraryService.getLibrariesForAdmin(this.gradeId).subscribe(response => {
  //     response.forEach(res => { res.file = `${environment.API_ROOT}/${res.file}` })
  //     this.listOfLibraries = response;
  //   })
  // }

  getGradeById(gradeId: string) {
    this._GradesService.getGeadeByID(gradeId).subscribe({
      next: (res) => {
        this.filter.stageId = res.stageId
        this.filter.gradeId = res.gradeId
        this.filter.countryId = res.countryId
        // this.filter.semsterId = ''
        this.getLibrarys()

      }
    })
  }

  getLibrarys() {
    this._libraryService.getLibrarys(this.filter).subscribe({
      next: (res) => {
        this.listOfLibraries = res
      }
    })
  }

  // deleteQuestion(libraryId: string) {
  //   this.libraryId = libraryId;
  //   Swal.fire({
  //     title: "انتبه",
  //     icon: "warning",
  //     text: "بعد الحذف لا يمكن استرجاع البيانات , هل تريد الحذف ؟",
  //     confirmButtonText: "حذف",
  //     confirmButtonColor: "#dc3545",
  //     cancelButtonText: "إالغاء",
  //     showCancelButton: true,
  //   }).then(result => {
  //     if (result.isConfirmed) this.deleteLibrary();
  //   })
  // };

  // deleteLibrary() {
  //   this._libraryService.deleteLibrary(this.libraryId).subscribe(response => {
  //     // this.getLibraries();
  //   })
  // }
}
