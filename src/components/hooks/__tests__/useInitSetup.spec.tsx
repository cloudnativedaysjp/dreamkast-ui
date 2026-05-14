import React from 'react'
import 'cross-fetch/polyfill'
import { waitFor } from '@testing-library/react'
import { setupMockServer } from '../../../testhelper/msw'
import { rest } from 'msw'
import { MockEvent, MockProfile } from '../../../testhelper/fixture'
import { useInitSetup } from '../useInitSetup'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import auth from '../../../store/auth'
import settings from '../../../store/settings'
import appData from '../../../store/appData'
import {
  GetApiV1ByEventAbbrMyProfileApiResponse,
  GetApiV1EventsByEventAbbrApiResponse,
} from '../../../generated/dreamkast-api.generated'

const server = setupMockServer()

describe('useInitSetup', () => {
  it('should fetch event and profile', async () => {
    const eventAbbr = 'cicd2023'
    const got: any = {}
    const eventFn = jest.fn()
    const profileFn = jest.fn()
    server.use(
      rest.get(`/api/v1/events/:eventAbbr`, (req, res, ctx) => {
        eventFn()
        got.eventAbbrOnEventReq = req.params.eventAbbr
        return res(
          ctx.json(MockEvent() as GetApiV1EventsByEventAbbrApiResponse),
        )
      }),
      rest.get(`/api/v1/:eventAbbr/my_profile`, (req, res, ctx) => {
        profileFn()
        got.eventAbbrOnProfileReq = req.params.eventAbbr
        return res(
          ctx.json(MockProfile() as GetApiV1ByEventAbbrMyProfileApiResponse),
        )
      }),
    )

    const Test = () => {
      const { event } = useInitSetup(eventAbbr)
      return !!event ? <div data-testid={'tgt'} /> : <div />
    }
    const store = setupStore()
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    Object.assign(got, {
      eventAbbr: store.getState().settings.eventAbbr,
      event: store.getState().settings.event,
      profile: store.getState().settings.profile,
    })

    const want = {
      eventAbbrOnEventReq: eventAbbr,
      eventAbbrOnProfileReq: eventAbbr,
      eventAbbr: eventAbbr,
      event: MockEvent(),
      profile: MockProfile(),
    }
    expect(eventFn).toHaveBeenCalled()
    expect(profileFn).toHaveBeenCalled()
    expect(got).toStrictEqual(want)
  })

  it('should not fetch event and profile when eventAbbr not provided', async () => {
    const eventFn = jest.fn()
    const profileFn = jest.fn()
    server.use(
      rest.get(`/api/v1/events/:eventAbbr`, (_, res, ctx) => {
        eventFn()
        return res(
          ctx.json(MockEvent() as GetApiV1EventsByEventAbbrApiResponse),
        )
      }),
      rest.get(`/api/v1/:eventAbbr/my_profile`, (_, res, ctx) => {
        profileFn()
        return res(
          ctx.json(MockProfile() as GetApiV1ByEventAbbrMyProfileApiResponse),
        )
      }),
    )

    const Test = () => {
      useInitSetup('')
      return <div data-testid={'tgt'} />
    }
    const store = setupStore()
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    expect(eventFn).not.toHaveBeenCalled()
    expect(profileFn).not.toHaveBeenCalled()
  })

  it('should redirect to registration page when my_profile returns 404', async () => {
    const eventAbbr = 'cicd2023'
    const dkUrl = 'https://event.cloudnativedays.jp'
    server.use(
      rest.get(`/api/v1/events/:eventAbbr`, (_, res, ctx) => {
        return res(
          ctx.json(MockEvent() as GetApiV1EventsByEventAbbrApiResponse),
        )
      }),
      rest.get(`/api/v1/:eventAbbr/my_profile`, (_, res, ctx) => {
        return res(ctx.status(404), ctx.json({}))
      }),
    )

    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { href: '' },
    })

    try {
      const Test = () => {
        useInitSetup(eventAbbr)
        return <div data-testid={'tgt'} />
      }
      const store = setupStore({
        auth: { ...auth.getInitialState(), dkUrl },
        settings: settings.getInitialState(),
        appData: appData.getInitialState(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        api: {} as any,
      })
      const screen = renderWithProviders(<Test />, { store })
      await screen.findByTestId('tgt')
      const expectedHref = `${dkUrl}/${eventAbbr}/registration`
      await waitFor(
        () => {
          expect(window.location.href).toBe(expectedHref)
        },
        { timeout: 15000 },
      )
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: originalLocation,
      })
    }
  }, 30000)
})
