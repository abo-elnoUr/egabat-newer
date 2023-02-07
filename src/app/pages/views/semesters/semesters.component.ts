import { Component, OnInit } from '@angular/core';
import { ISemester } from 'src/app/helpers/_interfaces/semesters';
import Swal from 'sweetalert2';
import { SemesterService } from './service/semester.service';

@Component({
  selector: 'app-semesters',
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.scss']
})
export class SemestersComponent implements OnInit {

  constructor(
    private _semestersService: SemesterService
  ) { }

  ngOnInit(): void {
    this.getSemesters();
  }

  listOfSemesters: ISemester[] = [];
  getSemesters() {
    this._semestersService.getSemesters().subscribe(response => {
      this.listOfSemesters = response
    })
  }

  semesterId: string = "";
  deleteQuestion(semesterId: string) {
    this.semesterId = semesterId;
    Swal.fire({
      title: "انتبه",
      icon: "warning",
      text: "بعد الحذف لا يمكن استرجاع البيانات , هل تريد الحذف ؟",
      confirmButtonText: "حذف",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "إالغاء",
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) this.deleteSemester();
    })
  }

  deleteSemester() {
    this._semestersService.deleteSemester(this.semesterId).subscribe(response => {
      this.getSemesters();
    })
  }

}
