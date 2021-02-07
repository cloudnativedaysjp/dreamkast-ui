import React from 'react'
import renderer from 'react-test-renderer'
import Player from '../Player'

test('Player', () => {
  const component = renderer.create(
    <Player vimeoId={'453943528'} autoplay={true} />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
