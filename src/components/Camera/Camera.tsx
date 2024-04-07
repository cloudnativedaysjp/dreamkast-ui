import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react'

type Props = {
  height: number
  width: number
}

export const Camera: React.FC<Props> = ({ height, width }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const getStream = useCallback(async () => {
    const aspectRatio = height / width
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        // width: {
        //   ideal: IDEAL_VIDEO_WIDTH,
        // },
        aspectRatio,
      },
      audio: false,
    })
  }, [width, height])

  useEffect(() => {
    let stream: MediaStream | null = null
    const video = videoRef.current

    // 取得したstreamをvideo要素に流す
    const setVideo = async () => {
      stream = await getStream()
      if (video === null || !stream) {
        return
      }
      video.srcObject = stream
      video.play()
    }

    setVideo()

    // streamを停止させる
    const cleanupVideo = () => {
      if (!stream) {
        return
      }
      stream.getTracks().forEach((track) => track.stop())
      if (video === null) {
        return
      }
      video.srcObject = null
    }
    return cleanupVideo
  }, [getStream])

  return (
    <video
      ref={videoRef}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      autoPlay
      muted
      playsInline
    />
  )
}
