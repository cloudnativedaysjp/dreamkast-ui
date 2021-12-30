import React from 'react'
import renderer from 'react-test-renderer'
import { Layout } from '../Layout'

test('Layout', () => {
  const event = {
    id: 1,
    name: 'CloudNativeDays Tokyo 2021',
    abbr: 'cndt2021',
    status: 'registered',
    theme: 'this is theme',
    about: 'this is about',
    privacy_policy: 'this is privacy policy',
    privacy_policy_for_speaker: 'this is privacy_policy_for_speaker',
    copyright: 'this is copyright',
    coc: 'this is coc',
  }
  const component = renderer.create(<Layout title="Test" event={event} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
