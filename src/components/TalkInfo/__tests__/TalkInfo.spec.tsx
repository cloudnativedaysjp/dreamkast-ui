import React from 'react'
import { render } from '@testing-library/react'
import { MockEvent, MockTalkA1, MockTrackA } from '../../../testhelper/fixture'
import { PTalkInfo } from '../TalkInfo'

// TODO fix following by extracting Presentation Component
describe('PTalkInfo', () => {
  it('should render without crash', () => {
    const screen = render(
      <PTalkInfo
        eventAbbr={MockEvent().abbr}
        selectedTalk={MockTalkA1()}
        selectedTrack={MockTrackA()}
        showVideoToggle={true}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render when props undefined', () => {
    const screen = render(<PTalkInfo eventAbbr={MockEvent().abbr} />)
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
