import React from 'react'
import {
  MockTalkA1,
  MockTalkA2,
  MockTalkA3,
  MockTalks,
} from '../../../testhelper/fixture'
import { extractAvailableTalks, PTalkSelector } from '../TalkSelector'
import { Talk } from '../../../generated/dreamkast-api.generated'
import dayjs from 'dayjs'
import { render } from '@testing-library/react'

describe('extractAvailableTalks', () => {
  it('should provide sorted talks with available props only for showOnTimetable flag is true', () => {
    const hide = (talk: Talk) => {
      talk.showOnTimetable = false
      return talk
    }

    const given = {
      talks: [
        MockTalkA2(),
        MockTalkA3(),
        MockTalkA1(),
        hide(MockTalkA1()),
        hide(MockTalkA2()),
      ],
      now: dayjs('2023-02-24T10:30:00.000+09:00').unix(),
    }
    const want: ReturnType<typeof extractAvailableTalks> = [
      { ...MockTalkA1(), available: true },
      { ...MockTalkA2(), available: true },
      { ...MockTalkA3(), available: false },
    ]
    expect(extractAvailableTalks(given.talks, given.now)).toStrictEqual(want)
  })
})

describe('PTalkSelector', () => {
  it('should render without crash', () => {
    const now = dayjs('2023-02-24T10:30:00.000+09:00').unix()
    const screen = render(
      <PTalkSelector
        selectedTalkId={MockTalks()[0].id}
        selectedTrackId={32}
        talks={MockTalks()}
        isLiveMode={true}
        changeLiveMode={() => null}
        selectTalk={() => null}
        now={now}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
  it('should render when props undefined', () => {
    const now = dayjs('2023-02-24T10:30:00.000+09:00').unix()
    const screen = render(
      <PTalkSelector
        talks={[]}
        changeLiveMode={() => null}
        selectTalk={() => null}
        now={now}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
