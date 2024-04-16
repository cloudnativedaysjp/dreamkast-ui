import React from 'react'
import 'cross-fetch/polyfill'
import { rest } from 'msw'
import { Chat } from '../Chat'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import {
  MockChats,
  MockEvent,
  MockProfile,
  MockTalkA1,
} from '../../../testhelper/fixture'
import {
  ChatMessage,
  GetApiV1ChatMessagesApiResponse,
} from '../../../generated/dreamkast-api.generated'
import { setupMockServer } from '../../../testhelper/msw'
import { setProfile } from '../../../store/settings'
import { setWsBaseUrl } from '../../../store/auth'
import { fireEvent } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'

const server = setupMockServer(
  rest.get(`/api/v1/chat_messages`, (_, res, ctx) => {
    return res(ctx.json(MockChats() as GetApiV1ChatMessagesApiResponse))
  }),
  rest.get('http://localhost:8080/cable', (_, res, ctx) => {
    return res(ctx.status(101))
  }),
)

describe('Chat', () => {
  it('should fetch chat data and render without crash', async () => {
    const got = {
      eventAbbr: '',
      roomId: '',
      roomType: '',
    }

    const fn = jest.fn()
    const fnCable = jest.fn()
    server.use(
      rest.get(`/api/v1/chat_messages`, (req, res, ctx) => {
        got.eventAbbr = req.url.searchParams.get('eventAbbr') as string
        got.roomId = req.url.searchParams.get('roomId') as string
        got.roomType = req.url.searchParams.get('roomType') as string
        fn()
        return res(ctx.json(MockChats() as GetApiV1ChatMessagesApiResponse))
      }),
      rest.get('http://localhost:8080/cable', (_, res, ctx) => {
        fnCable()
        return res(ctx.status(101))
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })
    const want = {
      eventAbbr: mockProps.event.abbr,
      roomId: `${mockProps.talk.id}`,
      roomType: 'talk',
    }

    await screen.findAllByText('わいわい')
    expect(fn).toHaveBeenCalled()
    expect(fnCable).toHaveBeenCalled()
    expect(got).toStrictEqual(want)
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render without crash when no data provided', async () => {
    const fn = jest.fn()
    const fnCable = jest.fn()
    server.use(
      rest.get(`/api/v1/chat_messages`, (_, res, ctx) => {
        fn()
        return res(ctx.json([] as GetApiV1ChatMessagesApiResponse))
      }),
      rest.get('http://localhost:8080/cable', (_, res, ctx) => {
        fnCable()
        return res(ctx.status(101))
      }),
    )

    const mockProps = {
      event: MockEvent(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })

    expect(fn).not.toHaveBeenCalled()
    expect(fnCable).not.toHaveBeenCalled()
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should create new chat', async () => {
    let called = false
    let got: ChatMessage = {}
    const want: ChatMessage = {
      body: 'テスト',
      eventAbbr: 'cndt2022',
      messageType: 'chat',
      roomId: 701,
      roomType: 'talk',
    }

    server.use(
      rest.post('/api/v1/chat_messages', async (req, res) => {
        got = (await req.json()) as ChatMessage
        called = true
        return res()
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })
    await screen.findAllByText('わいわい')

    fireEvent.change(screen.getByTestId('message-form'), {
      target: { value: want.body },
    })
    fireEvent.click(screen.getByTestId('submit-chat'))

    await waitFor(() => expect(called).toBeTruthy())
    expect(got).toStrictEqual(want)
  })

  it('should create new qa', async () => {
    let called = false
    let got: ChatMessage = {}
    const want: ChatMessage = {
      body: 'テスト',
      eventAbbr: 'cndt2022',
      messageType: 'qa',
      roomId: 701,
      roomType: 'talk',
    }

    server.use(
      rest.post('/api/v1/chat_messages', async (req, res) => {
        got = (await req.json()) as ChatMessage
        called = true
        return res()
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })
    await screen.findAllByText('わいわい')

    fireEvent.change(screen.getByTestId('message-form'), {
      target: { value: want.body },
    })
    fireEvent.click(screen.getByTestId('submit-qa'))

    await waitFor(() => expect(called).toBeTruthy())
    expect(got).toStrictEqual(want)
  })

  it('should delete message', async () => {
    let called = false
    let got: ChatMessage = {}
    const want: ChatMessage = {
      body: 'このメッセージは削除されました',
      eventAbbr: 'cndt2022',
    }

    server.use(
      rest.put('/api/v1/chat_messages/:msgId', async (req, res) => {
        got = (await req.json()) as ChatMessage
        called = true
        return res()
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })
    await screen.findAllByText('わいわい')

    fireEvent.click(screen.getAllByTestId('message-menu-btn')[0])
    fireEvent.click(await screen.findByTestId('message-delete-btn'))

    await waitFor(() => expect(called).toBeTruthy())
    expect(got).toStrictEqual(want)
  })

  it('should post reply', async () => {
    let called = false
    let got: ChatMessage = {}
    const want: ChatMessage = {
      body: '返信テスト',
      eventAbbr: 'cndt2022',
      messageType: 'chat',
      replyTo: 286,
      roomId: 701,
      roomType: 'talk',
    }

    server.use(
      rest.post('/api/v1/chat_messages', async (req, res) => {
        got = (await req.json()) as ChatMessage
        called = true
        return res()
      }),
    )

    const mockProps = {
      event: MockEvent(),
      talk: MockTalkA1(),
      defaultTab: '0',
    }

    const store = setupStore()
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setWsBaseUrl('http://localhost:8080'))
    const screen = renderWithProviders(<Chat {...mockProps} />, { store })
    await screen.findAllByText('わいわい')

    fireEvent.click(screen.getAllByTestId('message-reply-btn')[0])
    fireEvent.change(screen.getByTestId('message-reply-form'), {
      target: { value: want.body },
    })
    fireEvent.click(screen.getByTestId('submit-reply'))

    await waitFor(() => expect(called).toBeTruthy())
    expect(got).toStrictEqual(want)
  })
})
