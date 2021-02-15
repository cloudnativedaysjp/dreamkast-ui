import React from 'react'
import renderer from 'react-test-renderer'
import TrackView from '../Track'

test('Track', async () => {
  const component = renderer.create(<TrackView selectedTrackId={1} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
