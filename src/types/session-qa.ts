export type SessionQuestion = {
  id: number
  body: string
  profile: {
    id: number
    name: string
  }
  votes_count: number
  has_voted: boolean
  created_at: string
  answers: SessionQuestionAnswer[]
}

export type SessionQuestionAnswer = {
  id: number
  body: string
  speaker: {
    id: number
    name: string
  }
  created_at: string
}

export type QuestionSortType = 'votes' | 'time'

export type WebSocketMessage =
  | {
      type: 'question_created'
      question: SessionQuestion
    }
  | {
      type: 'question_voted'
      question_id: number
      votes_count: number
      has_voted: boolean
    }
  | {
      type: 'answer_created'
      question_id: number
      answer: SessionQuestionAnswer
    }
