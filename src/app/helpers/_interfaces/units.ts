export interface IUnit {
  unitId: string
  unitName: string
  subjectId: string
  subjectName: string
  semesterId: string
  semesterName: string
  index: number
  isActive: boolean
}

export interface IUnitsFilter {
  subjectId: string
  semesterId: string
}