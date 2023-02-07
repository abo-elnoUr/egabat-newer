import { Component, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { IAdvertisment } from 'src/app/helpers/_interfaces/advertiesment';
import Swal from 'sweetalert2';
import { AdvertismentService } from './advertisment.service';

@Component({
  selector: 'app-advertisment',
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.scss']
})
export class AdvertismentComponent implements OnInit {
  SITE_URL = `${environment.API_ROOT}/`;
  listOfAdvertisemnet: IAdvertisment[] = [];
  constructor(
    private _advertisementService: AdvertismentService
  ) { }

  ngOnInit(): void {
    this.getAdvertisement();
  }

  listOfFilterdAdvertisemnet: IAdvertisment[][] = [[]]; // For Test Only
  getAdvertisement() {
    this._advertisementService.getAds().subscribe(response => {
      this.listOfAdvertisemnet = response;
    });
  }

  advertisementId: string = "";
  deleteQuestion(advertisementId: string) {
    this.advertisementId = advertisementId;
    Swal.fire({
      title: "انتبه",
      icon: "warning",
      text: "بعد الحذف لا يمكن استرجاع البيانات , هل تريد الحذف ؟",
      confirmButtonText: "حذف",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "إالغاء",
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed) this.deleteAdvertisement();
    });
  };

  deleteAdvertisement() {
    this._advertisementService.deleteAd(this.advertisementId).subscribe(response => {
      this.getAdvertisement();
    })
  }
}
