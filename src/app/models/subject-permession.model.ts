export interface ISubjectPermession {
  displayName: string
  permessions: IPermession[]

}

export interface IPermession {
  permession: string
  displayName: string
  isSelected: boolean
}
