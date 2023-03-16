import React from 'react'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { VideoToggleButton } from '../common/VideoToggleButton'
import { IvsPlayerVideo } from './IvsPlayerVideo'

type Props = {
  playBackUrl?: string | null
  showVideoToggle?: boolean
}

export const IvsPlayer: React.FC<Props> = ({
  playBackUrl,
  showVideoToggle = false,
}) => {
  return (
    <CommonStyled.Container>
      <Styled.IvsPlayerContainer>
        <IvsPlayerVideo
          playBackUrl={playBackUrl}
          autoplay={true}
        ></IvsPlayerVideo>
      </Styled.IvsPlayerContainer>
      {showVideoToggle && <VideoToggleButton />}
    </CommonStyled.Container>
  )
}
