import React from 'react'
import * as Styled from './styled'

type Props = {
  vimeoId?: string
  autoplay: boolean
}

export const Player: React.FC<Props> = ({ vimeoId, autoplay }) => {
  return (
    <Styled.Container
      src={
        'https://player.vimeo.com/video/' +
        vimeoId +
        '?autoplay=' +
        Number(autoplay)
      }
      frameBorder="0"
      allow="autoplay; fullscreen"
      //webkitallowfullscreen
      //mozallowfullscreen
      allowFullScreen
    ></Styled.Container>
  )
}
