// 型定義は生成されたAPIからインポート
import {
  SessionQuestion,
  SessionQuestionAnswer,
} from '../generated/dreamkast-api.generated'

export type { SessionQuestion, SessionQuestionAnswer }

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
  | {
      type: 'question_deleted'
      question_id: number
    }
