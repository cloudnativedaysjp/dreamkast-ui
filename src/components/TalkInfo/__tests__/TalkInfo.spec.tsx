import React from 'react'
import { render } from '@testing-library/react'
import { MockEvent, MockTalkA1, MockTrackA } from '../../../testhelper/fixture'
import { PTalkInfo } from '../TalkInfo'

// TODO fix following by extracting Presentation Component
describe('PTalkInfo', () => {
  it('should render without crash', () => {
    render(
      <PTalkInfo
        eventAbbr={MockEvent().abbr}
        selectedTalk={MockTalkA1()}
        selectedTrack={MockTrackA()}
        viewerCount={'5'}
        showVideoToggle={true}
      />,
    )
  })
  it('should render when data empty', () => {
    render(<PTalkInfo eventAbbr={MockEvent().abbr} />)
  })
})
