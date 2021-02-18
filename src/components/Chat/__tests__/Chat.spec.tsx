import React from 'react'
import renderer from 'react-test-renderer'
import { Talks } from '../../../util/mock'
import { Chat } from '../Chat'

test('Chat', () => {
  const component = renderer.create(<Chat talk={Talks[0]} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
