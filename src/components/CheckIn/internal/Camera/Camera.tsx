import React, { useCallback, useEffect, useRef, useState } from 'react'
import { decodeQR } from '@paulmillr/qr/decode.js'
import { frameLoop, frontalCamera, QRCanvas } from '@paulmillr/qr/dom'
// import jsQR from 'jsqr'

type Props = {
  height: number
  width: number
  setCheckInDataToLocalStorage: (profileId: string) => void
  enableScan: boolean
}

const pad = (n, z = 2) => ('' + n).padStart(z, '0')

const time = () => {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds(),
  )}:${pad(d.getMilliseconds(), 3)}`
}

export const Camera: React.FC<Props> = ({
  height,
  width,
  setCheckInDataToLocalStorage,
  enableScan,
}) => {
  const [isStarted, setIsStarted] = useState(false)
  const [camera, setCamera] = useState<any>(null)
  const [canvasQr, setCanvasQr] = useState<QRCanvas | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [cancelMainLoop, setCancelMainLoop] = useState<() => void | null>()
  // const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // const bitmapRef = useRef<HTMLCanvasElement | null>(null)
  // const resultQr = useRef<HTMLCanvasElement | null>(null)
  const mainLoop = (camera: any, canvasQr: QRCanvas) => {
    console.log('mainLoop')
    frameLoop(() => {
      // console.log('newCanvasQr: ', newCanvasQr)
      console.log('canvasQr:', canvasQr)
      const result = camera.readFrame(canvasQr, false)
      if (result !== undefined) {
        console.log('Decoded:', result)
      }
    })
  }

  const handleStartStop = async () => {
    if (videoRef?.current && isStarted) {
      console.log('Stopping video capturing...')
      if (cancelMainLoop) cancelMainLoop()
      if (camera) camera.stop()
      if (canvasQr) canvasQr.clear()
      setIsStarted(false)
    } else {
      console.log('Starting video capturing...')
      try {
        if (videoRef.current && overlayRef.current) {
          const newCamera = await frontalCamera(videoRef.current)
          setCamera(newCamera)

          const newCanvasQr = new QRCanvas(
            { overlay: overlayRef.current },
            { cropToSquare: true },
          )
          setCanvasQr(newCanvasQr)

          setCancelMainLoop(mainLoop(newCamera, newCanvasQr))

          setIsStarted(true)
        }
      } catch (err) {
        console.error('Error starting video capturing:', err)
      }
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (camera) camera.stop()
      if (canvasQr) canvasQr.clear()
    }
  }, [camera, canvasQr])

  // const setupCanvas = useCallback(() => {
  //   if (canvasQr) canvasQr.clear()
  //   const newCanvasQr = new QRCanvas(
  //     {
  //       overlay: canvasRef.current || undefined,
  //       bitmap: bitmapRef.current || undefined,
  //       resultQR: resultQr.current || undefined,
  //     },
  //     { cropToSquare: true },
  //   )
  //   console.log('newCanvasQr: ', newCanvasQr)
  //   setCanvasQr(newCanvasQr)
  // }, [])

  // const mainLoop = useCallback(() => {
  //   ;(async () => {
  //     console.log('mainLoop~~~~~~~~~~~~~~~~~~~')
  //     const video = videoRef.current
  //     console.log('video: ', video)
  //     console.log('canvasQr: ', canvasQr)
  //     if (video && canvasQr) {
  //       const cam = await frontalCamera(video)
  //       console.log(cam)
  //       const res = cam.readFrame(canvasQr, false)
  //       console.log('res: ', res)
  //       if (res !== undefined) {
  //         console.log(`Decoded ${res}`)
  //       }
  //     }
  //   })()
  // }, [])
  //
  // useEffect(() => {
  //   // setupCanvas()
  //   console.log('canvasQr: ', canvasQr)
  //   ;(async () => {
  //     try {
  //       const video = videoRef.current
  //       if (video && canvasQr) {
  //         const cam = await frontalCamera(video)
  //         // const res = cam.readFrame(canvasQr, false)
  //         // if (res !== undefined) {
  //         //   console.log(`Decoded ${res}`)
  //         // }
  //         // setCamera(cam)
  //         console.log(cam)
  //         console.log('Started')
  //         // mainLoop()
  //         const intervalScan = setInterval(mainLoop, 5000)
  //         return () => {
  //           clearInterval(intervalScan)
  //         }
  //       }
  //     } catch (e) {
  //       console.error('Media loop', e)
  //     }
  //
  //   })()
  // }, [canvasQr])
  //
  // useEffect(() => {
  //   const newCanvasQr = new QRCanvas(
  //     {
  //       overlay: canvasRef.current || undefined,
  //       bitmap: bitmapRef.current || undefined,
  //       resultQR: resultQr.current || undefined,
  //     },
  //     { cropToSquare: true },
  //   )
  //   console.log('newCanvasQr: ', newCanvasQr)
  //   setCanvasQr(newCanvasQr)
  // }, [])

  return (
    <div>
      <button onClick={handleStartStop}>
        {isStarted ? 'Stop' : 'Start'} video capturing
      </button>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          display: isStarted ? 'block' : 'none',
        }}
        autoPlay
      />
      <canvas
        ref={overlayRef}
        style={{ display: isStarted ? 'block' : 'none', position: 'absolute' }}
      />
      {/*<canvas id="bitmap" ref={bitmapRef} />*/}
      {/*<canvas id="resultQr" ref={resultQr} />*/}
      {/*<div id="results-container"></div>*/}
    </div>
  )
}
