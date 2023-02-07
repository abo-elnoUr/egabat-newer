export interface IReport {
  rowCount: number
  requestsReport: IRequestReport[]
}


export interface IRequestReport {
  requestId: string
  requestNo: string
  replied: boolean
  gradeName: string
  teacherName: string
  subjectName: string
  studentName: string
  date: string
}


export interface IDashboardReport {
  "section": number
  "stage": number
  "grade": number
  "subject": number
  "student": number
  "teacher": number
  "request": number
  "repliedRequest": number
  "repliedInTimeRequest": number
  "notRepliedRequest": number
}