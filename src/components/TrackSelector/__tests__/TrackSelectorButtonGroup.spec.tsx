import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { MockTrackWithTalks } from '../../../testhelper/fixture'
import { TrackSelectorButtonGroup } from '../TrackSelectorButtonGroup'
import theme from '../../../styles/theme'
import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles'

describe('TrackSelectorButtonGroup', function () {
  it('renders without crash', () => {
    const data = MockTrackWithTalks()
    render(
      <MUIThemeProvider theme={theme}>
        <TrackSelectorButtonGroup
          data={data}
          selectedTrack={0}
          onChange={() => null}
        />
      </MUIThemeProvider>,
    )
  })

  it('renders when data empty', () => {
    render(
      <MUIThemeProvider theme={theme}>
        <TrackSelectorButtonGroup
          data={[]}
          selectedTrack={0}
          onChange={() => null}
        />
      </MUIThemeProvider>,
    )
  })

  it('called onChange callback when track selected', () => {
    const data = MockTrackWithTalks()
    const spy = jest.fn()
    const screen = render(
      <MUIThemeProvider theme={theme}>
        <TrackSelectorButtonGroup
          data={data}
          selectedTrack={0}
          onChange={spy}
        />
      </MUIThemeProvider>,
    )
    fireEvent.click(screen.getByText(data[0].track.name))

    expect(spy).toHaveBeenCalledWith(data[0].track.id)
  })
})
