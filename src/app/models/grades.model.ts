export interface IGradesGetAll {
    grades: IGrade[]
    rowCount: number
}


export interface IGrade {
    "gradeId": string
    "gradeName": string
    "index": number
    "stageId": string
    "stageName": string
    "isActive": boolean
    "countryName"?: string
}