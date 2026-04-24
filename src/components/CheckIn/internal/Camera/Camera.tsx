import React, { useCallback, useEffect, useRef, useState } from 'react'
import decodeQR from '@paulmillr/qr/decode'

type Props = {
  height: number
  width: number
  setCheckInDataToLocalStorage: (profileId: string) => void
  enableScan: boolean
}

type FrameLoop = {
  stop: () => void
}

export const Camera: React.FC<Props> = ({
  height,
  width,
  setCheckInDataToLocalStorage,
  enableScan,
}) => {
  const [isStarted, setIsStarted] = useState(false)
  const hasAutoStarted = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const lastScannedCodeRef = useRef<string>('')
  const isProcessingRef = useRef(false)
  const [error, setError] = useState<string>('')
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt')
  const [isInitializing, setIsInitializing] = useState(false)
  const frameLoopRef = useRef<FrameLoop | null>(null)

  // Keep callback prop in a ref so identity changes don't invalidate memoized callbacks.
  const setCheckInRef = useRef(setCheckInDataToLocalStorage)
  useEffect(() => {
    setCheckInRef.current = setCheckInDataToLocalStorage
  }, [setCheckInDataToLocalStorage])

  // Viewport width is used to clamp the container size. Read in an effect so SSR doesn't touch `window`.
  const [viewportWidth, setViewportWidth] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const handleQRCodeDetected = useCallback((profileId: string) => {
    if (isProcessingRef.current || profileId === lastScannedCodeRef.current) {
      return
    }
    isProcessingRef.current = true
    lastScannedCodeRef.current = profileId
    setCheckInRef.current(profileId)
  }, [])

  const stopFrameLoop = useCallback(() => {
    if (frameLoopRef.current) {
      frameLoopRef.current.stop()
      frameLoopRef.current = null
    }
  }, [])

  const beginScanLoop = useCallback(() => {
    stopFrameLoop()
    const video = videoRef.current
    const canvas = overlayRef.current
    if (!video || !canvas) return

    let rafId = 0
    let cancelled = false

    const scanFrame = () => {
      if (cancelled) return
      rafId = requestAnimationFrame(scanFrame)

      if (isProcessingRef.current) return
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return

      const w = video.videoWidth
      const h = video.videoHeight
      if (!w || !h) return

      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(video, 0, 0, w, h)
      const imageData = ctx.getImageData(0, 0, w, h)

      try {
        const qrResult = decodeQR({
          width: w,
          height: h,
          data: imageData.data,
        })
        if (!qrResult) return

        try {
          const qrData = JSON.parse(qrResult)
          if (qrData.profile_id) {
            handleQRCodeDetected(qrData.profile_id.toString())
          }
        } catch {
          // Not JSON — treat the raw result as a profile ID for legacy QR codes.
          handleQRCodeDetected(qrResult)
        }
      } catch {
        // decodeQR throws on every frame that doesn't contain a QR code; ignore.
      }
    }

    rafId = requestAnimationFrame(scanFrame)
    frameLoopRef.current = {
      stop: () => {
        cancelled = true
        cancelAnimationFrame(rafId)
      },
    }
  }, [handleQRCodeDetected, stopFrameLoop])

  const checkCameraPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      })
      setCameraPermission(permission.state)
      permission.onchange = () => setCameraPermission(permission.state)
    } catch {
      // Permission API not supported — fall through silently.
    }
  }, [])

  const stopScanning = useCallback(() => {
    stopFrameLoop()
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStarted(false)
    lastScannedCodeRef.current = ''
    setError('')
    setIsInitializing(false)
  }, [stopFrameLoop])

  const startScanning = useCallback(async () => {
    const video = videoRef.current
    if (!video || !overlayRef.current) return
    if (isInitializing) return

    setIsInitializing(true)
    setError('')

    try {
      if (video.srcObject) {
        const existing = video.srcObject as MediaStream
        existing.getTracks().forEach((track) => track.stop())
      }

      setIsStarted(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 640, max: 1280 },
        },
      })

      setCameraPermission('granted')
      video.srcObject = stream
      video.play().catch((err) => {
        console.warn('Video play failed:', err)
      })

      if (enableScan) {
        const start = () => {
          video.removeEventListener('loadedmetadata', start)
          beginScanLoop()
        }
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          beginScanLoop()
        } else {
          video.addEventListener('loadedmetadata', start)
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown camera error'
      setError(`Camera access error: ${message}`)
      setCameraPermission('denied')
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        video.srcObject = null
      }
    } finally {
      setIsInitializing(false)
    }
  }, [enableScan, beginScanLoop, isInitializing])

  const handleStartStop = () => {
    if (isStarted) {
      stopScanning()
    } else {
      startScanning()
    }
  }

  useEffect(() => {
    checkCameraPermission()
  }, [checkCameraPermission])

  // When the parent re-enables scanning (dialog closed), clear the processing lock.
  useEffect(() => {
    if (enableScan) {
      isProcessingRef.current = false
      lastScannedCodeRef.current = ''
    }
  }, [enableScan])

  // Auto-start scanning once on mount when scanning is enabled.
  useEffect(() => {
    if (enableScan && !isStarted && !hasAutoStarted.current) {
      hasAutoStarted.current = true
      startScanning()
    }
  }, [enableScan, isStarted, startScanning])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  const containerWidth =
    viewportWidth !== null ? Math.min(width, viewportWidth - 40) : width
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
        disabled={(!enableScan && !isStarted) || isInitializing}
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
          opacity: (enableScan || isStarted) && !isInitializing ? 1 : 0.5,
        }}
      >
        {isInitializing ? 'Initializing...' : isStarted ? 'Stop' : 'Start'}{' '}
        Scanning
      </button>

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
