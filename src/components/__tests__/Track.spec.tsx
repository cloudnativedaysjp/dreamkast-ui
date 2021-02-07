import React from 'react'
import renderer from 'react-test-renderer'
import { Talks } from '../../utils/talk-data'
import Track from '../Track'

test('Track', () => {
  const component = renderer.create(
    <Track
      selectedTalk={Talks[0]}
      selectedTrackId={'1'}
      talks={Talks}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      selectTalk={() => {}}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
