import React from 'react'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { VideoToggleButton } from '../common/VideoToggleButton'
import { IvsPlayerVideo } from './IvsPlayerVideo'
import { VideoCommand } from '../../store/settings'

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
            <p>アーカイブ中です。</p>
            <p>完了までお待ちください。</p>
          </Styled.TextContainer>
        </Styled.OverLayContainer>
      )
    }
    return <></>
  })()

  const paused = ['notSelected', 'preparing', 'archiving'].includes(
    videoCommand.status,
  )

  return (
    <CommonStyled.Container>
      <Styled.IvsPlayerContainer>
        <div>{videoComponent}</div>
        <IvsPlayerVideo
          playBackUrl={videoCommand.playBackUrl}
          autoplay={true}
          paused={paused}
        ></IvsPlayerVideo>
      </Styled.IvsPlayerContainer>
      {showVideoToggle && <VideoToggleButton />}
    </CommonStyled.Container>
  )
}
