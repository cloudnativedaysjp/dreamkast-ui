import React from 'react'
import renderer from 'react-test-renderer'
import { Talks } from '../../util/mock'
import TalkSelector from '../TalkSelector'

test('TalkSelector', () => {
  const component = renderer.create(
    <TalkSelector
      selectedTalk={Talks[0]}
      selectedTrackId={1}
      talks={Talks}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      selectTalk={() => {}}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
