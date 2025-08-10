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
  const [error, setError] = useState<string>('')
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt')

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

  const checkCameraPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      })
      setCameraPermission(permission.state)
      permission.onchange = () => setCameraPermission(permission.state)
    } catch (err) {
      console.warn('Permission API not supported')
    }
  }, [])

  const startScanning = useCallback(async () => {
    if (!videoRef.current || !overlayRef.current) return

    setError('')
    try {
      // frontalCamera handles camera access internally
      const newCamera = await frontalCamera(videoRef.current)
      setCamera(newCamera)
      setCameraPermission('granted')

      // Wait for video to be ready
      await new Promise((resolve) => {
        const checkVideoReady = () => {
          if (
            videoRef.current &&
            videoRef.current.readyState >= 2 &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
          ) {
            resolve(true)
          } else {
            setTimeout(checkVideoReady, 100)
          }
        }
        checkVideoReady()
      })

      // Set canvas size to match container dimensions
      const containerWidth = Math.min(width, window.innerWidth - 40)
      const containerHeight = Math.min(height, containerWidth) // Square aspect ratio

      overlayRef.current.width = containerWidth
      overlayRef.current.height = containerHeight

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
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown camera error'
      setError(`Camera access error: ${errorMessage}`)
      setCameraPermission('denied')
    }
  }, [enableScan, handleQRCodeDetected, width, height])

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
    setError('')
  }, [camera, canvasQr])

  const handleStartStop = async () => {
    if (isStarted) {
      stopScanning()
    } else {
      await startScanning()
    }
  }

  useEffect(() => {
    checkCameraPermission()
  }, [checkCameraPermission])

  useEffect(() => {
    return () => {
      if (cancelLoopRef.current) {
        cancelLoopRef.current()
      }
      if (camera) camera.stop()
      if (canvasQr) canvasQr.clear()
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [camera, canvasQr])

  const containerWidth = Math.min(width, window.innerWidth - 40)
  const containerHeight = Math.min(height, containerWidth)

  return (
    <div
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        maxWidth: '100%',
        margin: '0 auto',
      }}
    >
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
          objectFit: 'cover',
          display: isStarted ? 'block' : 'none',
          borderRadius: '8px',
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
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: '8px',
        }}
      />

      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            zIndex: 20,
            fontSize: '14px',
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {!isStarted && !error && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '16px',
            textAlign: 'center',
            padding: '20px',
            borderRadius: '8px',
            border: '2px dashed #ccc',
          }}
        >
          {!enableScan ? (
            'Scanning is disabled'
          ) : cameraPermission === 'denied' ? (
            <>
              <div style={{ marginBottom: '16px' }}>Camera access denied</div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                Please allow camera access and refresh the page
              </div>
            </>
          ) : (
            'Click "Start Scanning" to begin'
          )}
        </div>
      )}
    </div>
  )
}
