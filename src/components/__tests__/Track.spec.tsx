import React from 'react'
import renderer from 'react-test-renderer'
import Track from '../Track'

test('Track', () => {
  const component = renderer.create(<Track selectedTrackId={1} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
