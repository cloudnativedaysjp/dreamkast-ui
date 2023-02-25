import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { PLiveTalkList } from '../PLiveTalkList'
import { MockTrackWithTalks } from '../../../testhelper/fixture'

describe('PLiveTrackList', () => {
  it('renders without crash', () => {
    const data = MockTrackWithTalks()
    render(
      <PLiveTalkList data={data} selectedTrack={0} onChange={() => null} />,
    )
  })

  it('renders when data empty', () => {
    render(<PLiveTalkList data={[]} selectedTrack={0} onChange={() => null} />)
  })

  it('called onChange callback when track selected', () => {
    const data = MockTrackWithTalks()
    const spy = jest.fn()
    const screen = render(
      <PLiveTalkList data={data} selectedTrack={0} onChange={spy} />,
    )
    fireEvent.click(screen.getByText(data[0].track.name))

    expect(spy).toHaveBeenCalledWith(data[0].track.id)
  })
})
