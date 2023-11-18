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
      trackName: 'B',
      count: 5,
    }
    const got = {
      count: 0,
      confName: '',
    }

    const fn = jest.fn()
    server.use(
      graphql.query('GetViewerCount', (req, res, ctx) => {
        fn()
        got.confName = req.variables.confName
        return res(
          ctx.data({
            viewerCount: [
              {
                trackID: 41,
                trackName: 'A',
                count: 10,
              },
              {
                trackName: given.trackName,
                count: given.count,
              },
            ],
          }),
        )
      }),
    )

    const Test = () => {
      got.count = useViewerCount(given.confName, given.trackName)
      return !!got.count ? <div data-testid={'tgt'} /> : <div />
    }

    const screen = renderWithApolloClient(<Test />)
    await screen.findByTestId('tgt')

    expect(fn).toHaveBeenCalled()
    expect(got.confName).toBe(given.confName)
    expect(got.count).toBe(given.count)
  })
})
