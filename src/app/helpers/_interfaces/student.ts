export interface IStudentsObject {
  rowCount: number,
  students: IStudent[]
}



export interface IStudentFilter {
  "pageSize": number
  "pageNo": number
  "name": string
  "mobile": string
}


export interface IStudent {
  studentId: string
  name: string
  mobile: string
  email: null
  studentImage: string
  identityId: string
  isActive: boolean,
  stageId: string
  gradeId: string
  stageName: string
  gradeName: string
  sectionId: string
  sectionName: string

  premiumSubscription: boolean
}
