import { LibsCategs } from "../enums/libraries-categories.enum";

export interface ILibrary {
  libraryId: string
  gradeId: string
  gradeName: string
  semesterId: string
  semesterName: string
  categoryCode: LibsCategs
  name: string
  fileImage: string
  file: string
  index: number
  qrCode: string
}
