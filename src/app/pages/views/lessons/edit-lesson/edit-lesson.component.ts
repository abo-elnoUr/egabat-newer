import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from 'src/environments/environment';

const environment = env;;
import { ContentTypeFor } from 'src/app/helpers/enums/content-type-video-lesson';
import { PermessionHelper, RolesEnum, TeacherModule } from 'src/app/helpers/enums/roles-enum';
import { FilesTypes, ILessonDetails, ILessonFile, ILessonVideo, YOUTUBE_URL_VALIDATION } from 'src/app/helpers/_interfaces/lesson';
import { ILessonLiveVideo } from '../../../../helpers/_interfaces/lesson';
import { LessonsService } from '../service/lessons.service';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.scss']
})
export class EditLessonComponent implements OnInit {
  SITE_URL = `${environment.API_ROOT}/`;

  permessionHelper = new PermessionHelper();
  modules = TeacherModule;
  Roles = RolesEnum;
  get FileTypes(): typeof FilesTypes {

    return FilesTypes
  }

  get ContentTypeFor(): typeof ContentTypeFor {
    return ContentTypeFor
  }
  updateLessonForm: FormGroup;
  subjectId: string = "";
  lessonId: string = "";
  unitId: string = "";

  constructor(
    private _lessonSerivce: LessonsService,
    private _formBuilder: FormBuilder,
    private _activeRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.updateLessonForm = this._formBuilder.group({
      LessonId: ["", [Validators.required]],
      UnitId: ["", [Validators.required]],
      LessonName: ["", [Validators.required, Validators.minLength(3)]],
      Index: [0, [Validators.required]],
      Videos: this._formBuilder.array([]),
      Pdf: this._formBuilder.array([]),
      Rooms: this._formBuilder.array([])
    });
    this.updateLessonForm.get("UnitId")?.setValue(this._activeRoute.snapshot.params['unitId']);
    this.updateLessonForm.get("LessonId")?.setValue(this._activeRoute.snapshot.params['lessonId']);
    this.unitId = this._activeRoute.snapshot.params['unitId'];
    this.subjectId = this._activeRoute.snapshot.params['subjectId'];
    this.lessonId = this._activeRoute.snapshot.params['lessonId'];

  }

  get Lives(): FormArray {
    return this.updateLessonForm.get("Rooms") as FormArray
  }

  get LessonVideos(): FormArray {
    return this.updateLessonForm.get("Videos") as FormArray
  }

  addLessonLive(video: ILessonLiveVideo) {
    this.Lives.push(this.lessonLiveVideo(video));
  }

  addLessonVideo(videoData: ILessonVideo) {
    this.LessonVideos.push(this.lessonVideo(videoData));
  }

  removeLessonVideo(index: number) {
    this.LessonVideos.removeAt(index);
  }

  removeLessonLiveVideo(index: number) {
    this.Lives.removeAt(index);
  }

  lessonVideo(videoData: ILessonVideo): FormGroup {
    return this._formBuilder.group({
      Title: [videoData.title, [Validators.required, Validators.minLength(3)]],
      VideoLink: [videoData.videoLink, [Validators.required, Validators.pattern(YOUTUBE_URL_VALIDATION)]],
      ContentTypeFor: [videoData.contentTypeFor, [Validators.required, Validators.minLength(3)]],
      qrLink: [videoData.qrLink]
    })
  };

  lessonLiveVideo(videoData: ILessonLiveVideo) {
    return this._formBuilder.group({ LiveDate: [formatDate(videoData.liveDate, 'yyyy-MM-dd', 'en'), [Validators.required]] });
  }

  addNewLessonVideo() {
    return this.LessonVideos.push(this._formBuilder.group({
      Title: ["", [Validators.required, Validators.minLength(3)]],
      VideoLink: ["", [Validators.required, Validators.pattern(YOUTUBE_URL_VALIDATION)]],
      ContentTypeFor: [null, [Validators.required, Validators.minLength(3)]],
    }))
  }
  addNewLessonLiveVideo() {
    return this.Lives.push(this._formBuilder.group({ LiveDate: ['', [Validators.required]] }));
  }

  get Videos(): FormArray {
    return this.updateLessonForm.get("Videos") as FormArray
  }

  getVideoQr(index: number) {
    return this.Videos.controls[index]?.get('qrLink')?.value ?? "";
  }

  getFileQr(index: number) {
    return this.Files.controls[index]?.get('qrLink')?.value ?? "";
  }

  get Files(): FormArray {
    return this.updateLessonForm.get("Pdf") as FormArray
  };

  addNewLessonPDF() {
    return this.Files.push(this._formBuilder.group({
      Title: ["", [Validators.required, Validators.minLength(3)]],
      Pdf: ["", [Validators.required,]],
      Image: [null, [Validators.required, Validators.minLength(3)]],
      isNew: true
    }))
  }

  removeLessonFile(index: number) {
    this.Files.removeAt(index);
  }

  lessonPdf(file: ILessonFile, isNew: boolean): FormGroup {
    return this._formBuilder.group({
      Title: [file.name, [Validators.required]],
      Pdf: [file.file, [Validators.required]],
      Image: [file.fileImage, [Validators.required]],
      fileId: file.fileId,
      isNew: isNew,
      qrLink: file.qrLink
    }) as FormGroup
  };



  addlLessonFile(file: ILessonFile, isNew: boolean) {
    this.Files.push(this.lessonPdf(file, isNew))
  };

  previewFile(index: number, control: string) {
    // console.log('index', index);
    // console.log('control', control);
    let fileItem = this.Files.controls[index] as FormGroup;
    let file = fileItem.get(control)?.value;
    window.open(window.URL.createObjectURL(file));
  }

  upLoadFilePdf(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let Pdf = event.target.files[0];
    fileItem.get("Pdf")?.setValue(Pdf)

  }

  upLoadFileImage(event: any, index: number) {
    let fileItem = this.Files.controls[index] as FormGroup;
    let Image = event.target.files[0];
    fileItem.get("Image")?.setValue(Image);
  }

  deleteLessonAttchment(attachId: string, i: number) {
    this._lessonSerivce.deleteLessonAttachment(attachId).subscribe(response => {
      // console.log("Delete Attach", response);
      this.removeLessonFile(i)
    })
  }

  ngOnInit(): void {
    // this.submit();
    this.getLessonData()
  }

  mapLessonDataToForm(lessonData: ILessonDetails) {
    // this.updateLessonForm.get("").setValue("");
    this.updateLessonForm.patchValue({
      LessonId: lessonData.lesson.lessonId,
      UnitId: lessonData.lesson.unitId,
      LessonName: lessonData.lesson.lessonName,
      Index: lessonData.lesson.index
    });

    lessonData.lessonAttachments.videos.map(video => {
      this.addLessonVideo(video);
    });

    lessonData.lessonAttachments.files.map(file => {
      this.addlLessonFile(file, false)
    })

    lessonData.lessonAttachments.rooms.map(room => {
      this.addLessonLive(room);
    })

  }

  getLessonData() {
    this._lessonSerivce.getLessonById(this.lessonId).subscribe(response => {
      this.mapLessonDataToForm(response);
      // console.log("Lesson Data", response)
    })
  }

  mapperDataToFormData() {
    let fd = new FormData();
    // console.log(JSON.stringify(this.updateLessonForm.get("Videos")?.value))
    fd.append("UnitId", this.updateLessonForm.get("UnitId")?.value);
    fd.append("LessonId", this.updateLessonForm.get("LessonId")?.value);
    fd.append("LessonName", this.updateLessonForm.get("LessonName")?.value);
    fd.append("Index", this.updateLessonForm.get("Index")?.value);

    for (let v = 0; v < this.Videos.controls.length; v++) {
      fd.append(`Videos[${v}].Title`, this.Videos.controls[v].get("Title")?.value)
      fd.append(`Videos[${v}].VideoLink`, this.Videos.controls[v].get("VideoLink")?.value)
      fd.append(`Videos[${v}].ContentTypeFor`, this.Videos.controls[v].get("ContentTypeFor")?.value)
    };
    for (let j = 0; j < this.Lives.controls.length; j++) {
      fd.append(`Rooms[${j}].LiveDate`, this.Lives.controls[j].get('LiveDate')?.value);
    }

    let newFiles = this.Files.controls.filter((v, i) => v.get("isNew")?.value === true);

    for (let p = 0; p < newFiles.length; p++) {
      fd.append(`pdf[${p}].title`, newFiles[p].get("Title")?.value)
      fd.append(`pdf[${p}].pdf`, newFiles[p].get("Pdf")?.value)
      fd.append(`pdf[${p}].image`, newFiles[p].get("Image")?.value)
    };
    return fd;
  }

  isSubmiting: boolean = false;
  submit() {
    let data = this.mapperDataToFormData();
    this.isSubmiting = true;
    this._lessonSerivce.updateLesson(data).subscribe(response => {
      // console.log("Response", response);
      this.isSubmiting = false;
      this._router.navigate([`/Admin/dashboard/subjects/${this.subjectId}/units/${this.unitId}/lessons`])
    })
  }



  print() {
  }
}
