export interface CreateCompetitionQuestionDto {
  question: string;
  question_Image: FormFile;
  competition_Id: string;
  createCompetitionQuestionAnswerDtos: CreateCompetitionQuestionAnswerDto[];
}

export interface CreateCompetitionQuestionAnswerDto {
  answer_Dto: string;
  is_SelectedDto: boolean;
}

export interface CompetitionQuestionResponse{
  competitionQuestions: ResponseCompetitionQuestion[];
  rowCount: number;
}

export interface ResponseCompetitionQuestion {
  competition_Question_Id: string;
  question: string;
  question_Image: string;
  competition_Id: string;
  competition_Name: string;
  responseCompetitionQuestionAnswerDtos: ResponseCompetitionQuestionAnswer[];
}

export interface ResponseCompetitionQuestionAnswer {
  answer_Id?:string;
  answer_Response: string;
  is_Selected_Response: boolean;
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

export interface EditCompetitionQuestionAnswerDto {
  competitionId: string;
  questionId: string;
  answerId: string;
  answerText: string;
  isSelected: boolean;
}
