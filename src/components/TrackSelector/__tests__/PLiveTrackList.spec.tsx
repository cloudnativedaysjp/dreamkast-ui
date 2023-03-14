import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { PLiveTalkList } from '../PLiveTalkList'
import { MockTrackWithTalks } from '../../../testhelper/fixture'

describe('PLiveTrackList', () => {
  it('should render without crash', () => {
    const data = MockTrackWithTalks()
    const screen = render(
      <PLiveTalkList data={data} selectedTrack={0} onChange={() => null} />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render when data empty', () => {
    const screen = render(
      <PLiveTalkList data={[]} selectedTrack={0} onChange={() => null} />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should call onChange callback when track selected', () => {
    const data = MockTrackWithTalks()
    const spy = jest.fn()
    const screen = render(
      <PLiveTalkList data={data} selectedTrack={0} onChange={spy} />,
    )
    fireEvent.click(screen.getByText(data[0].track.name))

    expect(spy).toHaveBeenCalledWith(data[0].track.id)
  })
})
