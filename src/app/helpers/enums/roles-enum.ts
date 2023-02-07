export enum RolesEnum {
  SUPER_ADMIN = "SuperAdmin",
  SUBJECTS = "المواد",
  STUDENTS = "الطلاب",
  TEACHERS = "المعلمين",
  REPORTS = "التقارير",
  TECH_SUPPORT = "الدعم الفني",
  LIBRARIES = "المكتبات",
  GADES = "الصفوف"
}

export class PermessionHelper {
  public Permission = "Permession";

  public Add = "Add";
  public Update = "Update";
  public Delete = "Delete";

  public getPermession(subjectId: string, module: TeacherModule, permession: string): string {
    return `${subjectId}.${module}.${this.Permission}.${permession}`;
  }

}

export enum TeacherModule {
  Units = 'Units',
  Lessons = "Lessons",
  Questions = 'Questions'
}
// [
//   {
//     "roleName": "المواد",
//     "roleId": "c02238a0-8232-4369-9ad4-08d95d8937be"
//   },
//   {
//     "roleName": "الطلاب",
//     "roleId": "5e1c81da-0188-42cd-9ad5-08d95d8937be"
//   },
//   {
//     "roleName": "SuperAdmin",
//     "roleId": "58f6aecf-f07d-480b-a3b1-0cebbe7db5e0"
//   },
//   {
//     "roleName": "المعلمين",
//     "roleId": "293262db-70e8-4646-bbfd-10f7e947d797"
//   },
//   {
//     "roleName": "التقارير",
//     "roleId": "453ca22f-9ad2-48a6-b404-2ad3b42c1e44"
//   },
//   {
//     "roleName": "الدعم الفني",
//     "roleId": "949c63c1-76b3-41dd-a1a8-647d0014b405"
//   }
// ]
