export interface IGetQuestionsBank {
  id: string,
  questions: string,
  answer: string,
  subject: string
}
export interface IQuestionBankResponse {
  questions: IGetQuestionsBank[],
  count: number
}

export interface IGetQuestionById {
  id: string;
  answer: string;
  subjectId: string;
  questions: IQuestion[];
}
export interface IQuestion {
  question: string;
}