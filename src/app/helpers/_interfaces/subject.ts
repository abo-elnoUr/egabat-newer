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

  subjectSections?: SubjectSections[],
  subjectBranches?: SubjectBranchs[],
  subjectMzhbs?: SubjectMzhbs[]
}

export interface SubjectSections {
  sectionId: string,
  isSelected?: boolean,
  sectionName?: string
}

export interface SubjectBranchs {
  id?: string,
  branchId?: string,
  isSelected?: boolean,
  branchName?: string;
  name?:string;
}

export interface SubjectMzhbs {
  id?: string,
  mzhbId?: string,
  isSelected?: boolean,
  mzhbName?: string
  name?: string
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

export interface QuestionResponseDto{
  subjectQuestions: SubjectQuestionResponse[],
  rowCount: number
}

export interface SubjectQuestionResponse {
  subject_Id: string;
  question_Id: string;
  subject_Name: string;
  question_Text: string;
  question_Image: string;
  subjectExamAnswerResponses: SubjectQuestionAnswerResponse[];
}

export interface SubjectQuestionAnswerResponse {
  answer_Id: string;
  answer: string;
  is_Selected: boolean;
}
