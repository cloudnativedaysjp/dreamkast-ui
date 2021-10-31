import React, { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  playBackUrl?: string
  autoplay: boolean
  isLive: boolean
}

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

export const IvsPlayer: React.FC<Props> = ({
  playBackUrl,
  autoplay,
  isLive,
}) => {
  const playerRef = useRef<VideoJsPlayer>()
  const videoElement = useRef<HTMLVideoElement>(null)

  const videojsOptions = () => {
    if (isLive) {
      return {
        techOrder: ['AmazonIVS'],
        autoplay: autoplay,
        controls: true,
        muted: false,
      }
    } else {
      return {
        autoplay: autoplay,
        controls: true,
        muted: false,
      }
    }
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://player.live-video.net/1.4.1/amazon-ivs-videojs-tech.min.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if (!videoElement.current) return
      if (isLive) {
        registerIVSTech(videojs)
      }
      const options = videojsOptions()
      const player = videojs(videoElement.current, options, () => {
        console.log('Player is ready to use!')
        if (playBackUrl) player.src(playBackUrl)
      })
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
        />
      </Styled.IvsPlayerContainer>
    </CommonStyled.Container>
  )
}
