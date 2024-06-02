import React, { useCallback, useEffect, useRef } from 'react'
import jsQR from 'jsqr'

type Props = {
  height: number
  width: number
  setCheckInDataToLocalStorage: (profileId: string) => void
  enableScan: boolean
}

export const Camera: React.FC<Props> = ({
  height,
  width,
  setCheckInDataToLocalStorage,
  enableScan,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    console.log('enableScan:', enableScan)
  }, [enableScan])

  useEffect(() => {
    let stream: MediaStream | null = null
    const video = videoRef.current

    const setVideo = async () => {
      stream = await getStream()
      if (video === null || !stream) {
        return
      }
      video.srcObject = stream
      video.play()
    }

    setVideo()
    const intervalScan = setInterval(scanQrCode, 3000)

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

    return () => {
      clearInterval(intervalScan)
      cleanupVideo()
    }
  }, [getStream])

  const scanQrCode = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!enableScan) {
      console.log(`enableScan: ${enableScan}`)
    }
    if (canvas && video) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qrCodeData = jsQR(
          imageData.data,
          imageData.width,
          imageData.height,
        )
        if (qrCodeData != null) {
          console.log(qrCodeData)
        }
        if (qrCodeData && enableScan) {
          const profileId = JSON.parse(qrCodeData.data)['profile_id']
          setCheckInDataToLocalStorage(profileId)
        }
      }
    } else {
      console.log('canvas or video is null')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('This will run every 10 seconds!')
      const rawItem = localStorage.getItem('profiles')
      const profiles = JSON.parse(rawItem || '[]')

      for (const profile of profiles) {
        console.log(profile)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        muted
        playsInline
      />
      <div style={{ display: 'none' }}>
        <canvas ref={canvasRef} id="js-canvas"></canvas>
      </div>
    </div>
  )
}
