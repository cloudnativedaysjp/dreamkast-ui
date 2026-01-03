import React, { useEffect, useState, useCallback, useMemo } from 'react'
import * as Styled from './styled'
import { QuestionForm } from './internal/QuestionForm'
import { QuestionList } from './internal/QuestionList'
import {
  SessionQuestion,
  QuestionSortType,
  WebSocketMessage,
} from '../../types/session-qa'
import { Event, Talk } from '../../generated/dreamkast-api.generated'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { settingsSelector } from '../../store/settings'
import { baseApi } from '../../store/baseApi'
import dayjs from 'dayjs'
import { setupDayjs } from '../../util/setupDayjs'
import * as actionCable from 'actioncable'

setupDayjs()

// RTK Queryエンドポイントを定義
const sessionQAApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSessionQuestions: build.query<
      { questions: SessionQuestion[] },
      { talkId: number; sort?: 'votes' | 'time' }
    >({
      query: ({ talkId, sort = 'votes' }) => ({
        url: `/api/v1/talks/${talkId}/session_questions`,
        params: { sort },
      }),
      providesTags: (result, error, arg) => [
        { type: 'SessionQuestion', id: `LIST-${arg.talkId}` },
      ],
    }),
    createSessionQuestion: build.mutation<
      SessionQuestion,
      { talkId: number; body: string }
    >({
      query: ({ talkId, body }) => ({
        url: `/api/v1/talks/${talkId}/session_questions`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SessionQuestion', id: `LIST-${arg.talkId}` },
      ],
    }),
    voteSessionQuestion: build.mutation<
      { votes_count: number; has_voted: boolean },
      { talkId: number; questionId: number }
    >({
      query: ({ talkId, questionId }) => ({
        url: `/api/v1/talks/${talkId}/session_questions/${questionId}/vote`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SessionQuestion', id: `LIST-${arg.talkId}` },
      ],
    }),
    createSessionQuestionAnswer: build.mutation<
      SessionQuestion['answers'][0],
      { talkId: number; questionId: number; body: string }
    >({
      query: ({ talkId, questionId, body }) => ({
        url: `/api/v1/talks/${talkId}/session_questions/${questionId}/session_question_answers`,
        method: 'POST',
        body: { body },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SessionQuestion', id: `LIST-${arg.talkId}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSessionQuestionsQuery,
  useCreateSessionQuestionMutation,
  useVoteSessionQuestionMutation,
  useCreateSessionQuestionAnswerMutation,
} = sessionQAApi

type Props = {
  event: Event
  talk?: Talk
}

export const SessionQA: React.FC<Props> = ({ event, talk }) => {
  const [questions, setQuestions] = useState<SessionQuestion[]>([])
  const [sortBy, setSortBy] = useState<QuestionSortType>('votes')
  const [autoScroll, setAutoScroll] = useState(false)
  const { profile } = useSelector(settingsSelector)
  const { wsBaseUrl } = useSelector((state: RootState) => state.auth)

  // RTK Query hooks
  const {
    data: questionsData,
    isLoading,
    refetch: refetchQuestions,
  } = useGetSessionQuestionsQuery(
    { talkId: talk?.id || 0, sort: sortBy },
    { skip: !talk?.id },
  )

  const [createQuestion] = useCreateSessionQuestionMutation()
  const [voteQuestion] = useVoteSessionQuestionMutation()
  const [createAnswer] = useCreateSessionQuestionAnswerMutation()

  // 質問データを状態に反映
  useEffect(() => {
    if (questionsData?.questions) {
      const sorted = sortQuestions(questionsData.questions, sortBy)
      setQuestions(sorted)
    } else {
      setQuestions([])
    }
  }, [questionsData, sortBy])

  // ソート関数
  const sortQuestions = useCallback(
    (qs: SessionQuestion[], sort: QuestionSortType): SessionQuestion[] => {
      if (sort === 'votes') {
        return [...qs].sort((a, b) => {
          if (b.votes_count !== a.votes_count) {
            return b.votes_count - a.votes_count
          }
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
      } else {
        return [...qs].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
      }
    },
    [],
  )

  // WebSocket接続
  useEffect(() => {
    if (!talk?.id || !wsBaseUrl) return

    const wsUrl = new URL('/cable', wsBaseUrl).toString()
    const cable = actionCable.createConsumer(wsUrl)

    const subscription = cable.subscriptions.create(
      {
        channel: 'QaChannel',
        talk_id: talk.id,
      },
      {
        received: (data: WebSocketMessage) => {
          handleWebSocketMessage(data)
        },
      },
    )

    return () => {
      subscription?.unsubscribe()
      cable?.disconnect()
    }
  }, [talk?.id, wsBaseUrl, handleWebSocketMessage])

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === 'question_created') {
        setQuestions((prev) => {
          const exists = prev.some((q) => q.id === message.question.id)
          if (exists) return prev
          return sortQuestions([...prev, message.question], sortBy)
        })
      } else if (message.type === 'question_voted') {
        setQuestions((prev) => {
          const updated = prev.map((q) =>
            q.id === message.question_id
              ? {
                  ...q,
                  votes_count: message.votes_count,
                  has_voted: message.has_voted,
                }
              : q,
          )
          // 投票数が変わった場合はソートを再適用
          return sortQuestions(updated, sortBy)
        })
      } else if (message.type === 'answer_created') {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === message.question_id
              ? {
                  ...q,
                  answers: [...q.answers, message.answer],
                }
              : q,
          ),
        )
      }
    },
    [sortBy, sortQuestions],
  )

  const handleQuestionSubmit = useCallback(
    async (body: string) => {
      if (!talk?.id || !body.trim()) return

      try {
        await createQuestion({
          talkId: talk.id,
          body: body.trim(),
        }).unwrap()
        // WebSocketで質問が追加されるため、refetchは不要
      } catch (error) {
        console.error('Failed to create question:', error)
      }
    },
    [talk?.id, createQuestion],
  )

  const handleVote = useCallback(
    async (questionId: number) => {
      if (!talk?.id) return

      try {
        await voteQuestion({
          talkId: talk.id,
          questionId,
        }).unwrap()
      } catch (error) {
        console.error('Failed to vote:', error)
      }
    },
    [talk?.id, voteQuestion],
  )

  const handleAnswerSubmit = useCallback(
    async (questionId: number, body: string) => {
      if (!talk?.id || !body.trim()) return

      try {
        await createAnswer({
          talkId: talk.id,
          questionId,
          body: body.trim(),
        }).unwrap()
      } catch (error) {
        console.error('Failed to create answer:', error)
      }
    },
    [talk?.id, createAnswer],
  )

  // スピーカー判定
  const isSpeaker = useMemo(() => {
    if (!talk || !profile) return false
    return talk.speakers?.some((s) => s.id === profile.speakerId) || false
  }, [talk, profile])

  // 常に質問可能
  const isVisibleForm = true

  if (!talk) {
    return (
      <Styled.Container>
        <Styled.EmptyText>セッションを選択してください</Styled.EmptyText>
      </Styled.Container>
    )
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>Q&A</Styled.Title>
        <Styled.SortButtons>
          <Styled.SortButton
            active={sortBy === 'votes'}
            onClick={() => setSortBy('votes')}
          >
            投票数順
          </Styled.SortButton>
          <Styled.SortButton
            active={sortBy === 'time'}
            onClick={() => setSortBy('time')}
          >
            時間順
          </Styled.SortButton>
        </Styled.SortButtons>
      </Styled.Header>

      <QuestionForm
        isVisibleForm={isVisibleForm}
        onSubmit={handleQuestionSubmit}
      />

      <QuestionList
        questions={questions}
        isLoading={isLoading}
        autoScroll={autoScroll}
        isSpeaker={isSpeaker}
        onVote={handleVote}
        onAnswerSubmit={handleAnswerSubmit}
      />
    </Styled.Container>
  )
}
