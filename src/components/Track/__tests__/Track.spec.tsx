import React from 'react'
import renderer from 'react-test-renderer'
import { Talks } from '../../../util/mock'
import { TrackView } from '../Track'

test('Track', () => {
  const component = renderer.create(
    <TrackView propTalks={Talks} selectedTrackId={1} />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
