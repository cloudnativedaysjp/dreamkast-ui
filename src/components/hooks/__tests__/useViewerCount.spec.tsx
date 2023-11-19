import React from 'react'
import 'cross-fetch/polyfill'
import { renderWithApolloClient } from '../../../testhelper/store'
import { useViewerCount } from '../useViewerCount'
import { graphql } from 'msw'
import { setupMockServer } from '../../../testhelper/msw'

const server = setupMockServer()

describe.only('useViewerCount', () => {
  it('should fetch viewer count', async () => {
    const given = {
      confName: 'cndf2023',
      profileId: 42,
      trackName: 'B',
      count: 5,
    }
    const got = {
      count: 0,
      confName: '',
    }

    const fn = jest.fn()
    const mutateFn = jest.fn()
    server.use(
      graphql.query('GetViewerCount', (req, res, ctx) => {
        fn()
        got.confName = req.variables.confName
        return res(
          ctx.data({
            viewerCount: [
              {
                trackName: 'A',
                count: 10,
              },
              {
                trackName: 'B',
                count: given.count,
              },
            ],
          }),
        )
      }),
      graphql.mutation('ViewTrack', (req) => {
        mutateFn()
        expect(req.variables.profileID).toBe(given.profileId)
        expect(req.variables.trackName).toBe(given.trackName)
      }),
    )

    const Test = () => {
      got.count = useViewerCount(
        given.confName,
        given.profileId,
        given.trackName,
      )
      return !!got.count ? <div data-testid={'tgt'} /> : <div />
    }

    const screen = renderWithApolloClient(<Test />)
    await screen.findByTestId('tgt')

    expect(fn).toHaveBeenCalled()
    expect(got.confName).toBe(given.confName)
    expect(got.count).toBe(given.count)
    expect(mutateFn).toHaveBeenCalled()
  })
})
