import React, { useEffect, useRef, useState } from 'react'
import videojs, { VideoJsPlayer } from 'video.js'
import { Talk } from '../../client-axios'
import 'video.js/dist/video-js.css'

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  playBackUrl?: string | null
  autoplay: boolean
  showCountdown: boolean
  nextTalk?: Talk
  updateView: () => void
  stopUpdate: () => void
}

declare function registerIVSTech(
  vjs: typeof videojs,
  config?: { wasmWorker: string; wasmBinary: string },
): void

export const IvsPlayer: React.FC<Props> = ({
  playBackUrl,
  autoplay,
  showCountdown,
  nextTalk,
  updateView,
  stopUpdate,
}) => {
  const playerRef = useRef<VideoJsPlayer>()
  const videoElement = useRef<HTMLVideoElement>(null)
  const [counter, setCounter] = useState<number>(5)
  const [timer, setTimer] = useState<NodeJS.Timer>()

  const cancelUpdate = () => {
    clearInterval(timer as NodeJS.Timer)
    setCounter(5)
    stopUpdate()
  }

  const updateSession = () => {
    updateView()
    setCounter(5)
  }

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

  useEffect(() => {
    if (counter === 0) updateSession()

    const timer =
      showCountdown &&
      counter > 0 &&
      setInterval(() => setCounter(counter - 1), 1000)
    setTimer(timer as NodeJS.Timer)
    return () => clearInterval(timer as NodeJS.Timer)
  }, [counter, showCountdown])

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
        {showCountdown && (
          <Styled.OverLayContainer>
            <Styled.TextContainer>
              <p>次のセッションまで {counter}秒</p>
              <Styled.NextTitle>{nextTalk?.title}</Styled.NextTitle>
            </Styled.TextContainer>
            <Styled.ButtonContainer>
              <Styled.PlayerButton onClick={cancelUpdate}>
                キャンセル
              </Styled.PlayerButton>
              <Styled.PlayerButton onClick={updateSession}>
                すぐに再生
              </Styled.PlayerButton>
            </Styled.ButtonContainer>
          </Styled.OverLayContainer>
        )}
      </Styled.IvsPlayerContainer>
    </CommonStyled.Container>
  )
}
