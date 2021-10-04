import React, { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  playBackUrl?: string
  autoplay: boolean
}

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

export const IvsPlayer: React.FC<Props> = ({ playBackUrl, autoplay }) => {
  const playerRef = useRef<VideoJsPlayer>()
  const videoElement = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://player.live-video.net/1.4.1/amazon-ivs-videojs-tech.min.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (!playBackUrl || !videoElement.current) return
      registerIVSTech(videojs)
      const player = videojs(
        videoElement.current,
        {
          techOrder: ['AmazonIVS'],
          autoplay: autoplay,
        },
        () => {
          player.src(playBackUrl)
        },
      )
      playerRef.current = player
    })

    return () => {
      if (playerRef.current) playerRef.current.dispose()
      document.body.removeChild(script)
    }
  }, [playBackUrl])

  return (
    <CommonStyled.Container>
      <Styled.IvsPlayerContainer>
        <Styled.IvsPlayerVideo
          ref={videoElement}
          className="video-js vjs-16-9 vjs-big-play-centered"
          controls
          autoPlay
          playsInline
        />
      </Styled.IvsPlayerContainer>
    </CommonStyled.Container>
  )
}
