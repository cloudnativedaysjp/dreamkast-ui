import React from 'react'
import renderer from 'react-test-renderer'
import { Talk } from '../../interfaces'
import Chat from '../chat'

const mockTalk: Talk = {
  id: 1,
  trackId: '1',
  vimeoId: '453943528',
  title: 'ほげふが',
  description: 'ぴよぴよ',
  speakers: ['jacopen1', 'r_takaishi2'],
}

test('Chat', () => {
  const component = renderer.create(<Chat talk={mockTalk} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
