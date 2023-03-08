import React from 'react'
import 'cross-fetch/polyfill'
import { useAddStampIfSatisfied, useStampCompleteBonus } from '../hooks'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import { setEventAbbr, setProfile } from '../../../store/settings'
import {
  MockDkUiData,
  MockEvent,
  MockProfile,
} from '../../../testhelper/fixture'
import { setAppData } from '../../../store/appData'
import { stampLocation } from '../internal/const'
import { PrivateCtx } from '../../../context/private'
import { setupMockServer } from '../../../testhelper/msw'
import { rest } from 'msw'
import {
  DkUiDataMutation,
  ProfilePointRequest,
} from '../../../generated/dreamkast-api.generated'
import { waitToBeSatisfied } from '../../../testhelper/waitToBeSatisfied'
import {
  setAllStampCollected,
  setQRCodeStampResult,
} from '../../../util/sessionstorage/trailMap'

const server = setupMockServer()

describe('useStampCompleteBonus', () => {
  it('should post for stamp complete bonus', async () => {
    let called = false
    const got = {
      profileId: 0,
      conference: '',
      pointEventId: '',
    }
    const want = {
      profileId: MockProfile().id,
      conference: MockEvent().abbr,
      pointEventId: 'dummy',
    }

    const mockGetPointEventId = jest.fn()
    mockGetPointEventId.mockReturnValue(want.pointEventId)
    server.use(
      rest.post(`/api/v1/profile/:profileId/point`, async (req, res) => {
        const { conference, pointEventId } =
          (await req.json()) as ProfilePointRequest
        got.profileId = parseInt(req.params.profileId as string)
        got.conference = conference
        got.pointEventId = pointEventId
        called = true
        return res()
      }),
    )

    const mockAppData = MockDkUiData()
    for (let i = 0; i < stampLocation.length; i++) {
      mockAppData.stampChallenges.push({
        slotId: i,
        waiting: false,
        condition: 'stamped',
      })
    }
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    const Test = () => {
      useStampCompleteBonus()
      return <div data-testid={'tgt'} />
    }

    renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: mockGetPointEventId }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    expect(await waitToBeSatisfied(() => called)).toBeTruthy()
    expect(got).toStrictEqual(want)
  })

  it('should not post when not completed', async () => {
    let called = false

    const mockGetPointEventId = jest.fn()
    mockGetPointEventId.mockReturnValue('dummy')
    server.use(
      rest.post(`/api/v1/profile/:profileId/point`, async (_, res) => {
        called = true
        return res()
      }),
    )

    const mockAppData = MockDkUiData()
    for (let i = 0; i < stampLocation.length - 1; i++) {
      mockAppData.stampChallenges.push({
        slotId: i,
        waiting: false,
        condition: 'stamped',
      })
    }
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    const Test = () => {
      useStampCompleteBonus()
      return <div data-testid={'tgt'} />
    }

    renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: mockGetPointEventId }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    await expect(waitToBeSatisfied(() => called)).rejects.toThrow()
  })

  it('should not post when already posted', async () => {
    let called = false

    const mockGetPointEventId = jest.fn()
    mockGetPointEventId.mockReturnValue('dummy')
    server.use(
      rest.post(`/api/v1/profile/:profileId/point`, async (_, res) => {
        called = true
        return res()
      }),
    )

    const mockAppData = MockDkUiData()
    for (let i = 0; i < stampLocation.length; i++) {
      mockAppData.stampChallenges.push({
        slotId: i,
        waiting: false,
        condition: 'stamped',
      })
    }
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    const Test = () => {
      useStampCompleteBonus()
      return <div data-testid={'tgt'} />
    }

    setAllStampCollected()
    renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: mockGetPointEventId }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    await expect(waitToBeSatisfied(() => called)).rejects.toThrow()
  })
})

describe('useAddStampIfSatisfied', () => {
  it('should post point event when satisfied condition for stamp', async () => {
    const got = {
      point: {
        profileId: 0,
        conference: '',
        pointEventId: '',
      },
      appData: {
        profileId: 0,
        conference: '',
        body: {} as DkUiDataMutation,
      },
    }
    const want = {
      point: {
        profileId: MockProfile().id,
        conference: MockEvent().abbr,
        pointEventId: 'dummy',
      },
      appData: {
        profileId: MockProfile().id,
        conference: MockEvent().abbr,
        body: {
          action: 'stampedFromUI',
          payload: {
            slotId: 42,
          },
        },
      },
    }

    const mockGetPointEventId = jest.fn()
    mockGetPointEventId.mockReturnValue(want.point.pointEventId)
    server.use(
      rest.post(`/api/v1/profile/:profileId/point`, async (req, res) => {
        const { conference, pointEventId } =
          (await req.json()) as ProfilePointRequest
        got.point.profileId = parseInt(req.params.profileId as string)
        got.point.conference = conference
        got.point.pointEventId = pointEventId
        return res()
      }),
      rest.post(
        `/api/v1/app-data/:profileId/conference/:conference`,
        async (req, res) => {
          const body = (await req.json()) as DkUiDataMutation
          got.appData.profileId = parseInt(req.params.profileId as string)
          got.appData.conference = req.params.conference as string
          got.appData.body = body
          return res()
        },
      ),
    )

    const mockAppData = MockDkUiData()
    mockAppData.stampChallenges.push({
      slotId: want.appData.body.payload.slotId,
      waiting: true,
    })
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    const Test = () => {
      const { addedNew, addedByQRCode } = useAddStampIfSatisfied()
      return addedNew && !addedByQRCode ? <div data-testid={'tgt'} /> : <div />
    }

    const screen = renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: mockGetPointEventId }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    await screen.findByTestId('tgt')
    expect(got).toStrictEqual(want)
  })

  it('should not post point event when condition for stamp not satisfied', async () => {
    let called = false
    const mockGetPointEventId = jest.fn()
    mockGetPointEventId.mockReturnValue('dummy')
    server.use(
      rest.post(`/api/v1/profile/:profileId/point`, async (_, res) => {
        called = true
        return res()
      }),
      rest.post(
        `/api/v1/app-data/:profileId/conference/:conference`,
        async (_, res) => {
          called = true
          return res()
        },
      ),
    )

    const mockAppData = MockDkUiData()
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    const Test = () => {
      useAddStampIfSatisfied()
      return <div data-testid={'tgt'} />
    }

    const screen = renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: mockGetPointEventId }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    await screen.findByTestId('tgt')
    await expect(waitToBeSatisfied(() => called)).rejects.toThrow()
  })

  it('should set addedByQRCode state to true when stamped by QRCode', async () => {
    const mockAppData = MockDkUiData()
    const store = setupStore()
    store.dispatch(setEventAbbr(MockEvent().abbr))
    store.dispatch(setProfile(MockProfile()))
    store.dispatch(setAppData(mockAppData))

    setQRCodeStampResult('ok')

    const Test = () => {
      const { addedNew, addedByQRCode } = useAddStampIfSatisfied()
      return addedNew && addedByQRCode ? <div data-testid={'tgt'} /> : <div />
    }

    const screen = renderWithProviders(
      <PrivateCtx.Provider value={{ getPointEventId: () => 'dummy' }}>
        <Test />
      </PrivateCtx.Provider>,
      { store },
    )
    await screen.findByTestId('tgt')
  })
})
