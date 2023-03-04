
export interface CompetitionResponse{
  competitions: ResponseCompetitionDto[];
  rowCount: number;
}

export interface EditCompetitionDto extends CreateCompetitionDto {
  id: string;
}

export interface ResponseCompetitionDto {
  id: string;
  address: string;
  competition_Image: string;
  startDate: string;
  endDate: string;
  timer: number;
  competitionStageResponses: CompetitionStageResponse[];
}

export interface CompetitionStageResponse {
  stageId: string | null;
  stageName?: string | null;
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
