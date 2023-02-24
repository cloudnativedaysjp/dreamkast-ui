import React from 'react'
import renderer from 'react-test-renderer'
import { TrackSelector } from '../TrackSelector'
import { MockTracks } from '../../../testhelper/fixture'

test.skip('TrackSelector', () => {
  const component = renderer.create(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <TrackSelector
      selectedTrack={MockTracks()[0]}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      selectTrack={() => {}}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
