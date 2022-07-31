import React from 'react'
import renderer from 'react-test-renderer'
import { IvsPlayer } from '../IvsPlayer'
import { Talks } from '../../../util/mock'

test('IvsPlayer', () => {
  const component = renderer.create(
    <IvsPlayer
      playBackUrl={
        'https://2a78e417f923.us-west-2.playback.live-video.net/api/video/v1/us-west-2.607167088920.channel.QFdTdOPixOx2.m3u8'
      }
      nextTalk={Talks[0]}
      autoplay={true}
      showCountdown={true}
      updateView={() => {
        return
      }}
      stopUpdate={() => {
        return
      }}
    />,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
