export interface IRecentChats {
  "chats": IChatRecent[]
  "rowCount": number

}


export interface IChatRecent {
  senderName: string
  senderIdentityId: string
  date?: string
}

export interface IRecentChatFilter {

  "sectionId"?: string
  "stageId"?: string
  "gradeId"?: string
  "studentName"?: string
  "studentNumber"?: string
  "pageNo": number
  "pageSize": number

}


export interface IChatHistory {
  senderName: string
  senderIdentityId: string
  isAdmin: Boolean
  message: string
  date: string

  attachment: string
  isFile: Boolean
  type: string
}



export interface IAdminReplay {
  receiverIdentityId: string,
  message: string
}
