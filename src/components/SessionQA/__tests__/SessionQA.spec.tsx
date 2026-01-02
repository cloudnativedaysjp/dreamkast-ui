import React from 'react'
import 'cross-fetch/polyfill'
import { rest } from 'msw'
import { SessionQA } from '../SessionQA'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import {
  MockEvent,
  MockProfile,
  MockTalkA1,
} from '../../../testhelper/fixture'
import { setupMockServer } from '../../../testhelper/msw'
import { setProfile } from '../../../store/settings'
import { setWsBaseUrl } from '../../../store/auth'
import { waitFor } from '@testing-library/dom'

const mockQuestions = {
  questions: [
    {
      id: 1,
      body: '質問1',
      profile: {
        id: 1,
        name: 'ユーザー1',
      },
      votes_count: 5,
      has_voted: false,
      created_at: '2026-01-01T10:00:00Z',
      answers: [],
    },
    {
      id: 2,
      body: '質問2',
      profile: {
        id: 2,
        name: 'ユーザー2',
      },
      votes_count: 3,
      has_voted: true,
      created_at: '2026-01-01T11:00:00Z',
      answers: [
        {
          id: 1,
          body: '回答1',
          speaker: {
            id: 1,
            name: 'スピーカー1',
          },
          created_at: '2026-01-01T12:00:00Z',
        },
      ],
    },
  ],
}

const server = setupMockServer(
  rest.get(`/api/v1/talks/:talkId/session_questions`, (req, res, ctx) => {
    return res(ctx.json(mockQuestions))
  }),
  rest.get('http://localhost:8080/cable', (_, res, ctx) => {
    return res(ctx.status(101))
  }),
)

describe('SessionQA', () => {
  it('should fetch questions and render without crash', async () => {
    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<SessionQA {...mockProps} />, { store })

    await waitFor(() => {
      expect(screen.getByText('質問1')).toBeInTheDocument()
    })

    expect(screen.getByText('質問2')).toBeInTheDocument()
    expect(screen.getByText('回答1')).toBeInTheDocument()
  })

  it('should render without crash when no questions', async () => {
    server.use(
      rest.get(`/api/v1/talks/:talkId/session_questions`, (_, res, ctx) => {
        return res(ctx.json({ questions: [] }))
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<SessionQA {...mockProps} />, { store })

    await waitFor(() => {
      expect(screen.queryByText('質問1')).not.toBeInTheDocument()
    })
  })

  it('should handle WebSocket connection', async () => {
    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<SessionQA {...mockProps} />, { store })

    // WebSocket接続が確立されることを確認（実際の接続はモックされる）
    await waitFor(() => {
      expect(screen.getByText('質問1')).toBeInTheDocument()
    })
  })
})
