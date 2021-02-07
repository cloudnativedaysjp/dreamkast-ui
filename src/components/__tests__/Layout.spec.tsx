import React from 'react'
import renderer from 'react-test-renderer'
import Layout from '../Layout'

test('Layout', () => {
  const component = renderer.create(<Layout title="Test" />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
