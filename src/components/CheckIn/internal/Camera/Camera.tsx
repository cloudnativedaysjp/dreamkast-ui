import React, { useCallback, useEffect, useRef, useState } from 'react'
import decodeQR from '@paulmillr/qr/decode'

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [lastScannedCode, setLastScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt')
  const [isInitializing, setIsInitializing] = useState(false)
  const frameLoopRef = useRef<{ stop: () => void; intervalId?: NodeJS.Timeout } | null>(null)

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
    if (isInitializing) {
      console.log('Already initializing, skipping...')
      return
    }

    setIsInitializing(true)
    setError('')
    console.log('Starting camera initialization...')

    try {
      console.log('Video element:', videoRef.current)
      console.log('Canvas element:', overlayRef.current)

      // Stop any existing stream first
      if (videoRef.current.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream
        existingStream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }

      // First try direct getUserMedia approach
      console.log('Requesting camera access via getUserMedia...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 640, max: 1280 },
        },
      })

      console.log('Got media stream:', stream)

      // Set stream and wait for it to load
      videoRef.current.srcObject = stream

      // Wait for loadedmetadata event to ensure video is ready
      await new Promise<void>((resolve, reject) => {
        const video = videoRef.current!
        const onLoadedMetadata = () => {
          console.log('Video metadata loaded')
          video.removeEventListener('loadedmetadata', onLoadedMetadata)
          resolve()
        }
        const onError = (_e: Event) => {
          video.removeEventListener('error', onError)
          reject(new Error('Video load error'))
        }

        if (video.readyState >= 1) {
          resolve()
        } else {
          video.addEventListener('loadedmetadata', onLoadedMetadata)
          video.addEventListener('error', onError)
        }
      })

      // Now play the video
      await videoRef.current.play()
      console.log('Video playing successfully')

      setCameraPermission('granted')

      // Video should be ready after loadedmetadata and play()
      console.log('Video is ready for QR scanning')

      // Set canvas size to match actual video dimensions
      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight

      console.log(`Video actual dimensions: ${videoWidth}x${videoHeight}`)

      // Set canvas to match video dimensions
      overlayRef.current.width = videoWidth
      overlayRef.current.height = videoHeight

      console.log(`Setting canvas size: ${videoWidth}x${videoHeight}`)

      // Set up QR scanning with @paulmillr/qr
      if (enableScan) {
        try {
          console.log('Setting up QR scanning with @paulmillr/qr')
          
          // Stop any existing frame loop
          if (frameLoopRef.current) {
            frameLoopRef.current.stop()
            frameLoopRef.current = null
          }
          
          const scanFrame = () => {
            try {
              if (!videoRef.current || !overlayRef.current) return
              
              // Draw video frame to canvas for QR detection
              const context = overlayRef.current.getContext('2d')!
              context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)
              
              // Get image data for QR detection
              const imageData = context.getImageData(0, 0, videoWidth, videoHeight)
              
              // Convert ImageData to the format expected by @paulmillr/qr
              const imageObject = {
                width: videoWidth,
                height: videoHeight,
                data: imageData.data
              }
              
              // Scan for QR codes using @paulmillr/qr decode function
              try {
                const qrResult = decodeQR(imageObject)
                if (qrResult) {
                  console.log('QR code detected:', qrResult)
                  
                  // Parse QR result as JSON to extract profile_id
                  try {
                    const qrData = JSON.parse(qrResult)
                    if (qrData.profile_id) {
                      handleQRCodeDetected(qrData.profile_id.toString())
                    } else {
                      console.warn('QR code does not contain profile_id:', qrData)
                    }
                  } catch (parseError) {
                    // If not JSON, use the raw result as profile ID
                    console.log('QR result is not JSON, using as raw profile ID')
                    handleQRCodeDetected(qrResult)
                  }
                  
                  if (frameLoopRef.current) {
                    clearInterval(frameLoopRef.current.intervalId)
                    frameLoopRef.current = null
                  }
                }
              } catch (decodeError) {
                // QR code not found or decode error - this is normal, continue scanning
                // Only log if it's not the common "Finder: len(found) = 0" error
                if (decodeError instanceof Error && !decodeError.message.includes('Finder: len(found) = 0')) {
                  console.warn('QR decode error:', decodeError.message)
                }
              }
            } catch (err) {
              console.error('Error during QR scanning:', err)
            }
          }
          
          // Use setInterval for frame scanning
          const intervalId = setInterval(scanFrame, 100) // Scan every 100ms
          frameLoopRef.current = { 
            stop: () => clearInterval(intervalId),
            intervalId 
          }
          
          console.log('QR scanning loop started')
        } catch (err) {
          console.error('Error setting up QR scanning:', err)
        }
      }

      setIsStarted(true)
      console.log('Camera initialization completed successfully')
    } catch (err) {
      console.error('Error starting video capturing:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown camera error'
      setError(`Camera access error: ${errorMessage}`)
      setCameraPermission('denied')

      // Clean up on error
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    } finally {
      setIsInitializing(false)
    }
  }, [enableScan, handleQRCodeDetected, width, height, isInitializing])

  const stopScanning = useCallback(() => {
    // Stop frame loop
    if (frameLoopRef.current) {
      frameLoopRef.current.stop()
      frameLoopRef.current = null
    }
    
    // Stop media stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStarted(false)
    setLastScannedCode('')
    setError('')
    setIsInitializing(false)
    console.log('Camera stopped')
  }, [])

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
      // Cleanup frame loop
      if (frameLoopRef.current) {
        frameLoopRef.current.stop()
        frameLoopRef.current = null
      }
      
      // Cleanup media stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

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
