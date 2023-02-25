import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { PLiveTrackList } from '../PLiveTrackList'
import { MockTrackWithTalks } from '../../../testhelper/fixture'

describe('PLiveTrackList', () => {
  it('renders without crash', () => {
    const data = MockTrackWithTalks()
    render(
      <PLiveTrackList data={data} selectedTrack={0} onChange={() => null} />,
    )
  })

  it('renders when data empty', () => {
    render(<PLiveTrackList data={[]} selectedTrack={0} onChange={() => null} />)
  })

  it('called onChange callback when track selected', () => {
    const data = MockTrackWithTalks()
    const spy = jest.fn()
    const screen = render(
      <PLiveTrackList data={data} selectedTrack={0} onChange={spy} />,
    )
    fireEvent.click(screen.getByText(data[0].track.name))

    expect(spy).toHaveBeenCalledWith(data[0].track.id)
  })
})
