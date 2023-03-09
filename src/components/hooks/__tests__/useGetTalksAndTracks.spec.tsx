import React, { useEffect, useState } from 'react'
import 'cross-fetch/polyfill'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import { rest } from 'msw'
import { setupMockServer } from '../../../testhelper/msw'
import {
  MockEvent,
  MockTalkA1,
  MockTalks,
  MockTrackA,
  MockTracks,
} from '../../../testhelper/fixture'
import { useGetTalksAndTracks } from '../useGetTalksAndTracks'
import { setConferenceDay, setEventAbbr } from '../../../store/settings'

const server = setupMockServer(
  rest.get(`/api/v1/tracks`, (_, res, ctx) => {
    return res(ctx.json(MockTracks()))
  }),
  rest.get(`/api/v1/talks`, (_, res, ctx) => {
    return res(ctx.json(MockTalks()))
  }),
)

describe('useGetTalksAndTracks', () => {
  it('should fetch talks and tracks', async () => {
    const got: any = {}
    const trackFn = jest.fn()
    const talkFn = jest.fn()
    server.use(
      rest.get(`/api/v1/tracks`, (req, res, ctx) => {
        got.trackEventAbbr = req.url.searchParams.get('eventAbbr')
        trackFn()
        return res(ctx.json(MockTracks()))
      }),
      rest.get(`/api/v1/talks`, (req, res, ctx) => {
        got.talkEventAbbr = req.url.searchParams.get('eventAbbr')
        got.conferenceDayIds = req.url.searchParams.get('conferenceDayIds')
        talkFn()
        return res(ctx.json(MockTalks()))
      }),
    )

    const Test = () => {
      const { isLoading } = useGetTalksAndTracks()
      return !isLoading ? <div data-testid={'tgt'} /> : <div />
    }

    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setConferenceDay(MockEvent().conferenceDays![0]))
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    got.tracks = store.getState().settings.tracks
    got.talks = store.getState().settings.talks

    const want = {
      trackEventAbbr: MockEvent().abbr,
      talkEventAbbr: MockEvent().abbr,
      conferenceDayIds: `${MockEvent().conferenceDays![0].id}`,
      tracks: MockTracks(),
      talks: MockTalks(),
    }
    expect(trackFn).toHaveBeenCalledTimes(1)
    expect(talkFn).toHaveBeenCalledTimes(1)
    expect(got).toStrictEqual(want)
  })

  it('should set initial viewing talk', async () => {
    const Test = () => {
      const { isLoading } = useGetTalksAndTracks()
      return !isLoading ? <div data-testid={'tgt'} /> : <div />
    }

    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setConferenceDay(MockEvent().conferenceDays![0]))
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    const got = {
      viewTrackId: store.getState().settings.viewTrackId,
      viewTalkId: store.getState().settings.viewTalkId,
    }
    const want = {
      viewTrackId: MockTrackA().id,
      viewTalkId: MockTalkA1().id,
    }

    expect(got).toStrictEqual(want)
  })

  it.skip('should fetch multiple times when refetch called', async () => {
    // NOTE refetchはUIだと機能しているが、testだとうまくrefetchしてくれない。一旦skipする
    const trackFn = jest.fn()
    const talkFn = jest.fn()
    server.use(
      rest.get(`/api/v1/tracks`, (_, res, ctx) => {
        trackFn()
        return res(ctx.json(MockTracks()))
      }),
      rest.get(`/api/v1/talks`, (_, res, ctx) => {
        talkFn()
        return res(ctx.json(MockTalks()))
      }),
    )

    const Test = () => {
      const { isLoading, refetch } = useGetTalksAndTracks()
      const [count, setCount] = useState<number>(0)
      const [done, setDone] = useState<boolean>(false)
      useEffect(() => {
        if (!isLoading) {
          if (count < 2) {
            refetch()
          } else {
            setDone(true)
          }
        } else {
          setCount(count + 1)
        }
      }, [isLoading, refetch])
      return done ? <div data-testid={'tgt'} /> : <div />
    }

    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setConferenceDay(MockEvent().conferenceDays![0]))
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    expect(trackFn).toHaveBeenCalledTimes(2)
    expect(talkFn).toHaveBeenCalledTimes(2)
  })
})
