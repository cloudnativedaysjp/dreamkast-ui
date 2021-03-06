import React from 'react'
import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  vimeoId?: string
  autoplay: boolean
}

export const Player: React.FC<Props> = ({ vimeoId, autoplay }) => {
  return (
    <CommonStyled.Container>
      <Styled.PlayerContainer>
        <Styled.PlayerIframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${Number(
          autoplay,
        )}`}
        frameBorder="0"
        allow="autoplay; fullscreen"
        //webkitallowfullscreen
        //mozallowfullscreen
        allowFullScreen
      />
      </Styled.PlayerContainer>
    </CommonStyled.Container>
  )
}
