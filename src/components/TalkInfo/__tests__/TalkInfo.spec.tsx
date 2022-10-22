import React from 'react'
import renderer from 'react-test-renderer'
import { MockEvent, Talks } from '../../../util/mock'
import { TalkInfo } from '../TalkInfo'

// TODO fix following by extracting Presentation Component
test.skip('TalkInfo', () => {
  const component = renderer.create(
    <TalkInfo event={MockEvent} selectedTalk={Talks[0]} />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
