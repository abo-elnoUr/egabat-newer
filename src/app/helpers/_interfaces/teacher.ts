import { ISubject } from './subject';

export interface ITeachersResponse {
    teachers: ITeacher[]
    rowCount: number
}

export interface ITeacher {
    teacherId: string
    identityId: string
    name: string
    mobile: string
    email: string
    status: Boolean
    subjects: Array<ISubject>
}

export interface ITeacherProfile {
    name: string
    mobile: string
    email: string
}

export interface IUpdateTeacherData {
    teacherId: string
    name: string
    mobile: string
    email: string
}






export interface ITeacherSubjects {
    subjects: Array<ISubject>
}

export interface IUpdateTeacherSubjects {
    teacherId: string
    subjects: Array<IUpdateSubjectPermession>
    updatedPermessions: Array<IUpdateSubjectPermession>
}
export interface IUpdateSubjectPermession {
    subjectId: string,
    permessions: Array<any>
}
