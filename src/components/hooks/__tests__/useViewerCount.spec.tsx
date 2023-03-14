import React from 'react'
import 'cross-fetch/polyfill'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import { useViewerCount } from '../useViewerCount'
import { rest } from 'msw'
import { GetApiV1TracksByTrackIdViewerCountApiResponse } from '../../../generated/dreamkast-api.generated'
import { setupMockServer } from '../../../testhelper/msw'

const server = setupMockServer()

describe('useViewerCount', () => {
  it('should fetch viewer count', async () => {
    const given = {
      trackId: 42,
      count: 5,
    }
    const got = {
      trackId: 0,
      count: 0,
    }

    const fn = jest.fn()
    server.use(
      rest.get(`/api/v1/tracks/:trackId/viewer_count`, (req, res, ctx) => {
        fn()
        const trackId = parseInt(req.params.trackId as string)
        got.trackId = trackId
        return res(
          ctx.json({
            trackId: trackId,
            viewerCount: given.count,
          } as GetApiV1TracksByTrackIdViewerCountApiResponse),
        )
      }),
    )

    const Test = () => {
      got.count = useViewerCount(given.trackId)
      return !!got.count ? <div data-testid={'tgt'} /> : <div />
    }

    const store = setupStore()
    const screen = renderWithProviders(<Test />, { store })
    await screen.findByTestId('tgt')

    expect(fn).toHaveBeenCalled()
    expect(got.trackId).toBe(given.trackId)
    expect(got.count).toBe(given.count)
  })
})
