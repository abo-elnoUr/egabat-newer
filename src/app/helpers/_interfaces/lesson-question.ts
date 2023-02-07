export interface ILessonQuestion {
  lessonQuestionId: string
  lessonId: string
  contentType: string
  question: string
  index: number
  answers: ILessonQuestionAnswer[]
}

export interface ILessonQuestionAnswer {
  lessonQuestionAnswerId: string
  contentType?: string
  answer: string
  isRight: boolean
  index: number
  isNew: boolean
}

