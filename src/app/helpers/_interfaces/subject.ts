import { ISubjectPermession } from "src/app/models/subject-permession.model"

export interface ISubjectFilterResponse {
  subjects: ISubject[]
  rowCount: number
}

export interface ISubject {
  country: string,
  tempSubjectId: string,
  subjectId: string,
  subjectName: string,
  stageId: string,
  stageName: string,
  gradeId: string,
  gradeName: string
  sectionName: string
  sectionId: string
  isActive: boolean
  subjectImage: string
  index: number,
  permessions: ISubjectPermession[]
}
export interface IPermession {
  moduleName: string
  permession: string[]
}

export interface IEditSubject {
  subjectId: string
  stageId: string,
  gradeId: string,
  subjectName: string
  sectionId: string
  isActive: boolean
  subjectImage: string
  index: number
}


export interface IExtraRequestResponse {
  "extraRequestId": string
  "studentId": string
  "subjectId": string
  "requestCount": number
}
