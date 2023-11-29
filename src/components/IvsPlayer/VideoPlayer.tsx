import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import * as Styled from './styled'

interface VideoPlayerProps {
  options: videojs.PlayerOptions
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ options }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<videojs.Player | null>(null)

  useEffect(() => {
    console.log('VideoPlayer.tsx: useEffect')
    // console.log('VideoPlayer.tsx options: ' + JSON.stringify(options))
    // 確実にvideoRefが存在することを確認し、適切な型として扱う
    const videoElement = videoRef.current as HTMLVideoElement
    if (!videoElement) return

    // video.jsのプレイヤーを初期化
    playerRef.current = videojs(videoElement, options)
    // console.log('sources: ' + JSON.stringify(options.sources))
    playerRef.current?.src(options.sources as videojs.Tech.SourceObject[])
    // console.log(
    //   'VideoPlayer.tsx playerRef.current: ' + JSON.stringify(playerRef.current),
    // )
    playerRef.current?.src(options.sources as videojs.Tech.SourceObject[])
    playerRef.current?.autoplay(true)

    // コンポーネントがアンマウントされた時にプレイヤーを破棄
    return () => {
      // if (playerRef.current) {
      //   playerRef.current.dispose()
      //   console.log('VideoPlayer.tsx playerRef.current.dispose()')
      // }
    }
  }, [options])

  return (
    <div data-vjs-player>
      <Styled.IvsPlayerVideo
        ref={videoRef}
        className="video-js vjs-16-9 vjs-big-play-centered"
      />
    </div>
  )
}
