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
  const isProcessingRef = useRef(false)
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
      isProcessingRef.current = true
      setLastScannedCode(profileId)

      console.log('QR Code detected:', profileId)
      setCheckInDataToLocalStorage(profileId)

      // Keep processing state true until enableScan becomes true again
      // (when the dialog is closed by the parent component)
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

      // Show UI immediately before camera loads
      setIsStarted(true)
      
      // Request camera access
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 640, max: 1280 },
        },
      })

      console.log('Got media stream:', stream)
      setCameraPermission('granted')

      // Set stream and play without waiting
      videoRef.current.srcObject = stream
      
      // Fire and forget - don't wait for play to complete
      videoRef.current.play().catch(err => {
        console.warn('Play failed, will retry:', err)
        // Retry play after a brief delay if it fails
        setTimeout(() => videoRef.current?.play(), 100)
      })
      
      console.log('Video playing')

      // Start QR scanning setup asynchronously
      if (enableScan) {
        // Use setTimeout to allow UI to update first
        setTimeout(() => {
          try {
            console.log('Setting up QR scanning...')
            
            // Stop any existing frame loop
            if (frameLoopRef.current) {
              frameLoopRef.current.stop()
              frameLoopRef.current = null
            }
            
            // Wait a bit for video to be ready, then start scanning
            const startScanLoop = () => {
              // Get actual video dimensions
              const videoWidth = videoRef.current?.videoWidth || 640
              const videoHeight = videoRef.current?.videoHeight || 640
              
              // Set canvas size
              if (overlayRef.current) {
                overlayRef.current.width = videoWidth
                overlayRef.current.height = videoHeight
              }
              
              const scanFrame = () => {
                try {
                  if (!videoRef.current || !overlayRef.current) return
                  
                  // Skip scanning if processing (dialog is open)
                  if (isProcessingRef.current) return
                  
                  // Get actual dimensions each frame (in case they change)
                  const currentWidth = videoRef.current.videoWidth || videoWidth
                  const currentHeight = videoRef.current.videoHeight || videoHeight
                  
                  // Update canvas size if needed
                  if (overlayRef.current.width !== currentWidth) {
                    overlayRef.current.width = currentWidth
                    overlayRef.current.height = currentHeight
                  }
                  
                  // Draw video frame to canvas for QR detection
                  const context = overlayRef.current.getContext('2d')!
                  context.drawImage(videoRef.current, 0, 0, currentWidth, currentHeight)
                  
                  // Get image data for QR detection
                  const imageData = context.getImageData(0, 0, currentWidth, currentHeight)
                  
                  // Convert ImageData to the format expected by @paulmillr/qr
                  const imageObject = {
                    width: currentWidth,
                    height: currentHeight,
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
                    }
                  } catch (decodeError) {
                    // QR code not found - this is normal, continue scanning silently
                    if (decodeError instanceof Error && !decodeError.message.includes('Finder: len(found) = 0')) {
                      console.warn('QR decode error:', decodeError.message)
                    }
                  }
                } catch (err) {
                  console.error('Error during QR scanning:', err)
                }
              }
              
              // Start scanning loop
              const intervalId = setInterval(scanFrame, 100)
              frameLoopRef.current = { 
                stop: () => clearInterval(intervalId),
                intervalId 
              }
              
              console.log('QR scanning started')
            }
            
            // Start scan loop after a brief delay to ensure video is ready
            setTimeout(startScanLoop, 500)
            
          } catch (err) {
            console.error('Error setting up QR scanning:', err)
          }
        }, 0)
      }

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

  // Reset processing state when enableScan changes to true (dialog closed)
  useEffect(() => {
    if (enableScan) {
      setIsProcessing(false)
      isProcessingRef.current = false
      setLastScannedCode('')  // Clear last scanned code when re-enabled
    }
  }, [enableScan])

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
