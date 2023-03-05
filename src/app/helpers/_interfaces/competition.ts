
export interface CompetitionResponse{
  competitions: ResponseCompetitionDto[];
  rowCount: number;
}

export interface EditCompetitionDto extends CreateCompetitionDto {
  id: string;
}


export interface ResponseCompetitionDto {
  competitionId: string;
  address: string;
  image: string;
  timer: number;
  start_Date: string;
  end_Date: string;
  stageId: string | null;
  gradeId: string | null;
  general: boolean;
}


export interface CreateCompetitionDto {
  address: string;
  image: FormFile;
  timer: number;
  start_Date: string;
  end_Date: string;
  stageId: string | null;
  gradeId: string | null;
}



export interface FormFile {
  contentType: string;
  contentDisposition: string;
  headers: HeaderDictionary;
  length: number;
  name: string;
  fileName: string;
}

export interface HeaderDictionary {
  contentLength: number | null;
}

export interface FilterDate {
  start_Date: string;
  end_Date: string;
}
