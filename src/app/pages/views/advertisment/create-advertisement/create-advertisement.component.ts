import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvertismentService } from '../advertisment.service';

@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss'],
})
export class CreateAdvertisementComponent implements OnInit {

  advertisementForm: FormGroup<{
    advertisement: FormArray<FormGroup<{
        advertisement: FormControl<string>;
        index: FormControl<number>;
        slideNumber: FormControl<number>;
        url: FormControl<string>;
      }>>
  }>;

  constructor(
    private _formBuilder: FormBuilder,
    private _advertisementService: AdvertismentService,
    private _route: Router
  ) {
    this.advertisementForm = this._formBuilder.group({
      advertisement: this._formBuilder.array<FormGroup<{
        advertisement: FormControl<string>;
        index: FormControl<number>;
        slideNumber: FormControl<number>;
        url: FormControl<string>;
      }>>([]),
    });

    //console.log(this.advertisementForm)
  }

  Advertisment(): FormGroup {
    return this._formBuilder.group({
      advertisement: [null, Validators.required],
      index: [null, Validators.required],
      slideNumber: [null, Validators.required],
      url: [''],
    });
  }

  get AdvertisementArray(): FormArray {
    return this.advertisementForm.get('advertisement') as FormArray;
  }

  addAdvertisement = () => this.AdvertisementArray.push(this.Advertisment());

  removeAdvertisement = (index: number) =>
    this.AdvertisementArray.removeAt(index);

  removeFile = (index: number) =>
    this.AdvertisementArray['controls'][index]
      .get('advertisement')
      ?.reset(null);

  uploadAdvertisementImage(e: any, index: number) {
    let files = e.target;
    this.AdvertisementArray.controls[index]
      .get('advertisement')
      ?.setValue(files[0]);
  }

  ngOnInit(): void {
    this.addAdvertisement();
  }

  mapDataToFormData() {
    let fd = new FormData();
    for (let p = 0; p < this.AdvertisementArray.controls.length; p++) {
      fd.append(
        `advertisements[${p}].advertisement`,
        this.AdvertisementArray.controls[p].get('advertisement')?.value
      );
      fd.append(
        `advertisements[${p}].index`,
        this.AdvertisementArray.controls[p].get('index')?.value
      );
      fd.append(
        `advertisements[${p}].slideNumber`,
        this.AdvertisementArray.controls[p].get('slideNumber')?.value
      );
      fd.append(
        `advertisements[${p}].url`,
        this.AdvertisementArray.controls[p].get('url')?.value
      );
    }
    return fd;
  }
  isSubmiting: boolean = false;
  submit() {
    if (this.advertisementForm.invalid) {
      return console.log(this.AdvertisementArray.value);
    }
    this.isSubmiting = true;
    this._advertisementService
      .addAds(this.mapDataToFormData())
      .subscribe((response) => {
        this.isSubmiting = false;
        //console.log(response);
        if (response) {
          this._route.navigate(['/Admin/dashboard/advertisement']);
        }
      });
  }
}
