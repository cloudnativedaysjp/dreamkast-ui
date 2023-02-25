import React, { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'
import { VideoToggleButton } from '../common/VideoToggleButton'

type Props = {
  playBackUrl?: string | null
  autoplay: boolean
  showStopVideoButton?: boolean
}

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

export const IvsPlayer: React.FC<Props> = ({
  playBackUrl,
  autoplay,
  showStopVideoButton = false,
}) => {
  const playerRef = useRef<VideoJsPlayer>()
  const videoElement = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://player.live-video.net/1.4.1/amazon-ivs-videojs-tech.min.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (!videoElement.current) return
      registerIVSTech(videojs)
      const player = videojs(
        videoElement.current,
        {
          techOrder: ['AmazonIVS'],
          autoplay: autoplay,
        },
        () => {
          console.log('Player is ready to use!')
          if (playBackUrl) player.src(playBackUrl)
        },
      )
      playerRef.current = player
    })

    return () => {
      if (playerRef.current) playerRef.current.dispose()
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!playBackUrl || !playerRef.current) return
    playerRef.current.src(playBackUrl)
    console.log(playerRef.current.currentSource())
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
          muted={false}
        />
      </Styled.IvsPlayerContainer>
      {showStopVideoButton && <VideoToggleButton />}
    </CommonStyled.Container>
  )
}
