export interface IAdmin {
  id: string
  userName: string
  email: string
}

export interface IRole {
  roleName: string
  selected: Boolean
}

export interface IAdminData {
  adminId: string,
  roles: Array<IRole>
}


export interface INewAdmin {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
  sectionId: string
}
