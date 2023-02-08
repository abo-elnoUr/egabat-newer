import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentTypeFor } from 'src/app/helpers/enums/content-type-video-lesson';
import { PermessionHelper, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { YOUTUBE_URL_VALIDATION } from 'src/app/helpers/_interfaces/lesson';
import { LessonsService } from '../service/lessons.service';
import { RolesEnum } from '../../../../helpers/enums/roles-enum';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.component.html',
  styleUrls: ['./add-lesson.component.scss']
})
export class AddLessonComponent implements OnInit {
  permessionHelper = new PermessionHelper();
  modules = TeacherModule;


  get ContentTypeFor(): typeof ContentTypeFor {
    return ContentTypeFor
  }
  ROLES = RolesEnum;
  createLessonForm: FormGroup;
  subjectId: string = "";
  unitId: string = "";
  constructor(
    private _lessonSerivce: LessonsService,
    private _formBuilder: FormBuilder,
    private _activeRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.createLessonForm = this._formBuilder.group({
      UnitId: ["", [Validators.required]],
      LessonName: ["", [Validators.required, Validators.minLength(3)]],
      Index: [0, [Validators.required]],
      Videos: this._formBuilder.array([this.lessonVideo()]),
      Pdf: this._formBuilder.array([this.lessonPdf()]),
      Rooms: this._formBuilder.array([this.lessonLiveVideo()])
    });
    this.createLessonForm.get("UnitId")?.setValue(this._activeRoute.snapshot.params['unitId']);
    this.unitId = this._activeRoute.snapshot.params['unitId'];
    this.subjectId = this._activeRoute.snapshot.params['subjectId'];

  }


  addLessonVideo() {
    this.Videos.push(this.lessonVideo());
  }
  addLessonLive() {
    this.Lives.push(this.lessonLiveVideo());
  }
  removeLessonVideo(index: number) {
    this.Videos.removeAt(index);
  }
  removeLessonLiveVideo(index: number) {
    this.Lives.removeAt(index)
  }
  lessonVideo(): FormGroup {
    return this._formBuilder.group({
      Title: ["", [Validators.required, Validators.minLength(3)]],
      VideoLink: ["", [Validators.required, Validators.pattern(YOUTUBE_URL_VALIDATION)]],
      ContentTypeFor: [null, [Validators.required, Validators.minLength(3)]],
    })
  }
  lessonLiveVideo(): FormGroup {
    return this._formBuilder.group
      (
        {
          LiveDate: [Date.now().toLocaleString(), [Validators.required]]
        }
      );
  }
  get Videos(): FormArray {
    return this.createLessonForm.get("Videos") as FormArray
  }
  get Lives(): FormArray {
    return this.createLessonForm.get("Rooms") as FormArray
  }

  addlLessonFile() {
    this.Files.push(this.lessonPdf())
  };
  removeLessonFile(index: number) {
    this.Files.removeAt(index);
  }
  lessonPdf(): FormGroup {
    return this._formBuilder.group({
      Title: ['', [Validators.required]],
      Pdf: [null, [Validators.required]],
      Image: [null, [Validators.required]]

    }) as FormGroup
  };
  get Files(): FormArray {
    return this.createLessonForm.get("Pdf") as FormArray
  };

  upLoadFilePdf(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let Pdf = event.target.files[0];
    fileItem.get("Pdf")?.setValue(Pdf)

  }
  previewFile(index: number, control: string) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let file = fileItem.get(control)?.value;
    window.open(window.URL.createObjectURL(file));
  }
  upLoadFileImage(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let Image = event.target.files[0];

    var reader = new FileReader();
    reader.onload = (_event: any) => {
      var path = _event.target.result;
    }
    reader.readAsDataURL(Image);

    fileItem.get("Image")?.setValue(Image);
  }







  ngOnInit(): void {
  }


  mapperDataToFormData() {
    let fd = new FormData();
    fd.append("UnitId", this.createLessonForm.get("UnitId")?.value);
    fd.append("LessonName", this.createLessonForm.get("LessonName")?.value);
    fd.append("Index", this.createLessonForm.get("Index")?.value);

    for (let v = 0; v < this.Videos.controls.length; v++) {
      fd.append(`Videos[${v}].Title`, this.Videos.controls[v].get("Title")?.value)
      fd.append(`Videos[${v}].VideoLink`, this.Videos.controls[v].get("VideoLink")?.value)
      fd.append(`Videos[${v}].ContentTypeFor`, this.Videos.controls[v].get("ContentTypeFor")?.value)
    };
    if (this.Files.length) {
      for (let p = 0; p <= this.Files.controls.length; p++) {
        fd.append(`pdf[${p}].title`, this.Files?.controls[p]?.get("Title")?.value)
        fd.append(`pdf[${p}].pdf`, this.Files?.controls[p]?.get("Pdf")?.value)
        fd.append(`pdf[${p}].image`, this.Files?.controls[p]?.get("Image")?.value)
      }
    };

    for (let p = 0; p < this.Lives.controls.length; p++) {
      fd.append(`Rooms[${p}].LiveDate`, this.Lives.controls[p].get('LiveDate')?.value);
    }
    // if(this.Files?.controls[0]?.get('Image')?.value)
    //     fd.append("myFile", this.Files.controls[0]?.get("Image")?.value)
    // if(this.Files?.controls[0]?.get('Pdf')?.value)
    //     fd.append("myFile2", this.Files.controls[0]?.get("Pdf")?.value)
    //console.log(fd);
    return fd;
  }

  isSubmiting: boolean = false;
  submit() {
    let data = this.mapperDataToFormData();

    console.log('data', data);
    this.isSubmiting = true;
    this._lessonSerivce.createLesson(data).subscribe(response => {
      //console.log("Response", response);
      this.isSubmiting = false;
      this._router.navigate([`/Admin/dashboard/subjects/${this.subjectId}/units/${this.unitId}/lessons`])
    })

    //console.log(this.createLessonForm.value)
  }
}
