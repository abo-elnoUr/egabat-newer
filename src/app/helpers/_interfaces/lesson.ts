export interface ILesson {
  "lessonId": string
  "unitId": string
  "unitName": string
  "lessonName": string
  "isActive": boolean
  "index": number
}



export interface ILessonDetails {
  "lesson": {
    "lessonId": string
    "unitId": string
    "unitName": string
    "lessonName": string
    "isActive": boolean
    "index": number
  },
  "lessonAttachments": {
    "files": ILessonFile[],
    "videos": ILessonVideo[],
    "rooms": ILessonLiveVideo[]
  }
}


export enum FilesTypes {
  Link = "Link",
  Image = "Image"
}

export interface ILessonFile {
  "fileId": string
  "name": string
  "type": string
  "file": string
  "fileImage": string
  "qrLink": string
}

export interface ILessonVideo {
  title: string
  videoLink: string
  contentTypeFor: string
  qrLink: string
}
export interface ILessonLiveVideo {
  liveDate: Date
}


export const YOUTUBE_URL_VALIDATION = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;


