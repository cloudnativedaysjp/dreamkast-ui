import React from 'react'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { VideoToggleButton } from '../common/VideoToggleButton'
import { VideoCommand } from '../../store/settings'
import { VideoPlayer } from './VideoPlayer'

type Props = {
  videoCommand: VideoCommand
  showVideoToggle?: boolean
}

export const IvsPlayer: React.FC<Props> = ({
  videoCommand,
  showVideoToggle = false,
}) => {
  const videoComponent = (() => {
    if (videoCommand.status === 'notSelected') {
      return (
        <Styled.OverLayContainer>
          <Styled.TextContainer>
            <p>セッションが選択されていません。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    if (videoCommand.status === 'notStarted') {
      return (
        <Styled.OverLayContainer>
          <Styled.TextContainer>
            <p>セッションの開始まで、しばらくお待ち下さい。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    if (videoCommand.status === 'done') {
      return (
        <Styled.OverLayContainer>
          <Styled.TextContainer>
            <p>セッションは終了しました。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    if (videoCommand.status === 'preparing') {
      return (
        <Styled.OverLayContainer>
          <Styled.TextContainer>
            <p>配信準備中です。</p>
            <p>しばらくお待ちください。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    if (videoCommand.status === 'archiving') {
      return (
        <Styled.OverLayContainer>
          <Styled.TextContainer>
            <p>セッションは終了しました。</p>
            <p>アーカイブ完了までお待ちください。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    return <></>
  })()

  const paused = ['notSelected', 'preparing', 'archiving'].includes(
    videoCommand.status,
  )

  const videoOptions = {
    autoplay: true,
    controls: true,
    playsInline: true,
    muted: false,
    sources: [
      {
        src: videoCommand.playBackUrl || '',
        type: 'application/x-mpegURL',
      },
    ],
    paused: { paused },
  }

  return (
    <CommonStyled.Container>
      <Styled.IvsPlayerContainer>
        <div>{videoComponent}</div>
        <VideoPlayer options={videoOptions} />
      </Styled.IvsPlayerContainer>
      {showVideoToggle && <VideoToggleButton />}
    </CommonStyled.Container>
  )
}
