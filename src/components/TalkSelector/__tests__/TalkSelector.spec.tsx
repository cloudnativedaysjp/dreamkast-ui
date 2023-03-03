import React from 'react'
import renderer from 'react-test-renderer'
import { MockTalks } from '../../../testhelper/fixture'
import { TalkSelector } from '../TalkSelector'

test('TalkSelector', () => {
  const component = renderer.create(
    <TalkSelector
      selectedTalk={MockTalks()[0]}
      selectedTrackId={1}
      talks={MockTalks()}
      changeLiveMode={() => null}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      selectTalk={() => {}}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
