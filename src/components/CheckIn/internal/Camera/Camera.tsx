import React, { useCallback, useEffect, useRef, useState } from 'react'
import { frameLoop, frontalCamera, QRCanvas } from '@paulmillr/qr/dom'

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
  const [isStarted, setIsStarted] = useState(false)
  const [camera, setCamera] = useState<Awaited<
    ReturnType<typeof frontalCamera>
  > | null>(null)
  const [canvasQr, setCanvasQr] = useState<QRCanvas | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const cancelLoopRef = useRef<(() => void) | null>(null)
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleQRCodeDetected = useCallback(
    (profileId: string) => {
      if (isProcessing || profileId === lastScannedCode) {
        return
      }

      setIsProcessing(true)
      setLastScannedCode(profileId)

      console.log('QR Code detected:', profileId)
      setCheckInDataToLocalStorage(profileId)

      setTimeout(() => {
        setIsProcessing(false)
      }, 2000)
    },
    [isProcessing, lastScannedCode, setCheckInDataToLocalStorage],
  )

  const startScanning = useCallback(async () => {
    if (!videoRef.current || !overlayRef.current) return

    try {
      const newCamera = await frontalCamera(videoRef.current)
      setCamera(newCamera)

      // Wait for video to be ready
      await new Promise((resolve) => {
        if (videoRef.current!.readyState >= 2) {
          resolve(true)
        } else {
          videoRef.current!.addEventListener(
            'loadeddata',
            () => resolve(true),
            {
              once: true,
            },
          )
        }
      })

      // Set canvas size to match video dimensions
      const videoWidth = videoRef.current!.videoWidth
      const videoHeight = videoRef.current!.videoHeight

      if (videoWidth === 0 || videoHeight === 0) {
        console.error('Video dimensions are invalid')
        return
      }

      overlayRef.current.width = videoWidth
      overlayRef.current.height = videoHeight

      const newCanvasQr = new QRCanvas(
        { overlay: overlayRef.current },
        { cropToSquare: true },
      )
      setCanvasQr(newCanvasQr)

      const cancel = frameLoop(() => {
        if (!enableScan) return

        try {
          const result = newCamera.readFrame(newCanvasQr, false)
          if (result !== undefined && result !== null) {
            handleQRCodeDetected(result)
          }
        } catch (err) {
          console.error('Error reading frame:', err)
        }
      })

      cancelLoopRef.current = cancel
      setIsStarted(true)
    } catch (err) {
      console.error('Error starting video capturing:', err)
    }
  }, [enableScan, handleQRCodeDetected])

  const stopScanning = useCallback(() => {
    if (cancelLoopRef.current) {
      cancelLoopRef.current()
      cancelLoopRef.current = null
    }
    if (camera) {
      camera.stop()
      setCamera(null)
    }
    if (canvasQr) {
      canvasQr.clear()
      setCanvasQr(null)
    }
    setIsStarted(false)
    setLastScannedCode('')
  }, [camera, canvasQr])

  const handleStartStop = async () => {
    if (isStarted) {
      stopScanning()
    } else {
      await startScanning()
    }
  }

  useEffect(() => {
    return () => {
      if (cancelLoopRef.current) {
        cancelLoopRef.current()
      }
      if (camera) camera.stop()
      if (canvasQr) canvasQr.clear()
    }
  }, [camera, canvasQr])

  return (
    <div style={{ position: 'relative', width, height }}>
      <button
        onClick={handleStartStop}
        disabled={!enableScan && !isStarted}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
          padding: '8px 16px',
          backgroundColor: isStarted ? '#f44336' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: enableScan || isStarted ? 'pointer' : 'not-allowed',
          opacity: enableScan || isStarted ? 1 : 0.5,
        }}
      >
        {isStarted ? 'Stop' : 'Start'} Scanning
      </button>

      {isProcessing && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            zIndex: 20,
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          QR Code Scanned!
        </div>
      )}

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
        playsInline
        muted
      />

      <canvas
        ref={overlayRef}
        style={{
          display: isStarted ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          maxWidth: '100%',
          maxHeight: '100%',
          pointerEvents: 'none',
        }}
      />

      {!isStarted && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '16px',
          }}
        >
          {enableScan
            ? 'Click "Start Scanning" to begin'
            : 'Scanning is disabled'}
        </div>
      )}
    </div>
  )
}
