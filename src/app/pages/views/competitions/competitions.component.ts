import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/helpers/services/sweet-alert.service';
import { CompetitionResponse } from 'src/app/helpers/_interfaces/competition';
import { environment } from 'src/environments/environment';
import { CompetitionService } from './api/competition.service';

const env = environment


@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit {

  pagination = {
    pageSize: 10,
    pageNo: 1,
  }

  listOfCompetitions: CompetitionResponse
  filterDateForm: FormGroup

  isLoading: boolean;
  closeResult = ''

  constructor(
    private _CompetitionService: CompetitionService,
    private _fb: FormBuilder,
    private _swal: SweetAlertService,
  ) {}

  ngOnInit(): void {
    document.title = `${env.webSiteName} | المسابقات`
    this.createFilterDate()

    // call functions
    this.getAllCompetition()
  }

  createFilterDate(){
    this.filterDateForm = this._fb.group({
      start_Date: [null, Validators.required],
      end_Date: [null, Validators.required],
    })
  }

  reset(){
    this.filterDateForm.reset()
    this.getAllCompetition()
  }


  getAllCompetition(){
    let filter = { ...this.pagination, ...this.filterDateForm.value };
    this.isLoading = true
    this._CompetitionService.getAllCompetitions(filter).subscribe({
      next: (competition) => {
        this.listOfCompetitions = competition
        this.isLoading = false

      }
    })
  }


  deleteCompetition(id: string) {
    this._CompetitionService.deleteCompetition(id).subscribe((response) => {
      this._swal.deleteSuccess();
      this.getAllCompetition()
    });
  }

  warningDeleting(id: string) {
    this._swal.warningDeleting().then((result) => {
      if (result.isConfirmed) {
        this.deleteCompetition(id);
      }
    });
  }


}
