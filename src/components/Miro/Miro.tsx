import React from 'react'
import * as Styled from './styled'

type Props = {
  miroId: string
  liveEmbed?: boolean
  viewport?: string
}

export const Miro: React.FC<Props> = ({ miroId, liveEmbed, viewport }) => {
  const embedMode = () => {
    return liveEmbed ? 'live-embed' : 'embed'
  }

  const getViewport = () => {
    return viewport !== undefined ? viewport + '&' : ''
  }

  const miroSrc = (miroId: string) => {
    return `https://miro.com/app/${embedMode()}/${miroId}/?${getViewport()}autoplay=yep`
  }

  return (
    <Styled.MiroContainer>
      <Styled.MiroIframe
        width="800"
        height="600"
        src={miroSrc(miroId)}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
      />
    </Styled.MiroContainer>
  )
}
