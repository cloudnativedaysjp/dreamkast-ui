import React from 'react'
import renderer from 'react-test-renderer'
import TrackSelector from '../TrackSelector'

test('TrackSelector', () => {
  const component = renderer.create(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <TrackSelector selectedTrackId={'1'} selectTrack={() => {}} />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
