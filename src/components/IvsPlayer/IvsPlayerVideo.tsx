import React, { useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'

type Props = {
  playBackUrl?: string | null
  autoplay: boolean
}

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

export const IvsPlayerVideo: React.FC<Props> = ({ playBackUrl, autoplay }) => {
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
    if (!playerRef.current) {
      return
    }
    if (!playBackUrl) {
      if (playerRef.current?.currentSource().src) {
        playerRef.current?.reset()
      }
      return
    }
    if (playBackUrl === playerRef.current?.currentSource().src) {
      return
    }
    playerRef.current.src(playBackUrl)
    console.log(playerRef.current.currentSource())
  }, [playBackUrl])

  return (
    <Styled.IvsPlayerVideo
      ref={videoElement}
      className="video-js vjs-16-9 vjs-big-play-centered"
      controls
      autoPlay
      playsInline
      muted={false}
    />
  )
}
