import React from 'react'
import { IvsPlayer } from '../IvsPlayer'
import { render } from '@testing-library/react'

describe('IvsPlayer', () => {
  it('should render video player when onAir', () => {
    const screen = render(
      <IvsPlayer
        videoCommand={{
          status: 'onAir',
          playBackUrl:
            'https://2a78e417f923.us-west-2.playback.live-video.net/api/video/v1/us-west-2.607167088920.channel.QFdTdOPixOx2.m3u8',
        }}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render video player when archived', () => {
    const screen = render(
      <IvsPlayer
        videoCommand={{
          status: 'archived',
          playBackUrl:
            'https://example.cloudfront.net/medialive/cndt2022/talks/0001/0001.m3u8',
        }}
      />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render preparing page', () => {
    const screen = render(<IvsPlayer videoCommand={{ status: 'preparing' }} />)
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render archiving page', () => {
    const screen = render(<IvsPlayer videoCommand={{ status: 'archiving' }} />)
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render not selected page', () => {
    const screen = render(
      <IvsPlayer videoCommand={{ status: 'notSelected' }} />,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
