export interface ISection {
  "sectionId": string
  "sectionName": string
  "isActive": boolean,
  "index": number,
  "countryName": string,
  "countryId": string
}

export interface IAddSection {
  "countryId": string,
  "sectionName": string,
  "index": number
}
export interface IEditSection extends IAddSection {
  "sectionId": string
}
