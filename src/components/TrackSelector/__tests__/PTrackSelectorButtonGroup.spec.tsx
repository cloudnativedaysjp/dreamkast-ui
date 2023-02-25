import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { MockTrackWithTalks } from '../../../testhelper/fixture'
import { PTrackSelectorButtonGroup } from '../PTrackSelectorButtonGroup'
import theme from '../../../styles/theme'
import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles'

describe('PTrackSelectorButtonGroup', function () {
  it('renders without crash', () => {
    const data = MockTrackWithTalks()
    render(
      <MUIThemeProvider theme={theme}>
        <PTrackSelectorButtonGroup
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
        <PTrackSelectorButtonGroup
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
        <PTrackSelectorButtonGroup
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
