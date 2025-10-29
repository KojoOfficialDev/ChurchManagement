import React, { memo, useCallback, useRef, useState } from 'react'
import { Camera, RefreshCw, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ImageUploadProps = {
  onUpload?: (file: File) => string | Promise<string>
  onUploadComplete?: (url: string) => void
  value?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ImageUpload = ({
  onUpload,
  onUploadComplete,
  value,
}: ImageUploadProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [captureMode, setCaptureMode] = useState<'camera' | 'file' | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      toast.error('Unable to access camera. Please check permissions.')
    }
  }, [])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })

          if (blob.size > MAX_FILE_SIZE) {
            toast.error('Image size exceeds 5MB limit')
            return
          }

          setSelectedFile(file)
          setPreviewUrl(URL.createObjectURL(blob))
          stopCamera()
        }
      },
      'image/jpeg',
      0.9,
    )
  }, [stopCamera])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 5MB limit')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCaptureMode(null)
    },
    [],
  )

  const handleUpload = useCallback(async () => {
    try {
      if (!selectedFile) throw new Error('No file selected')
      if (!onUpload) throw new Error('No upload function provided')
      setIsUploading(true)
      const url = await onUpload(selectedFile)
      if (!url) throw new Error('Upload failed')
      if (!onUploadComplete) return
      onUploadComplete(url)
      setSelectedFile(null)
      setCaptureMode(null)
      stopCamera()
      setDialogOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, onUpload, onUploadComplete])

  const resetState = useCallback(() => {
    setPreviewUrl(null)
    setSelectedFile(null)
    setCaptureMode(null)
    stopCamera()
  }, [stopCamera])

  const handleRetake = useCallback(() => {
    resetState()
    if (captureMode === 'camera') {
      startCamera()
    }
  }, [resetState, captureMode, startCamera])

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    resetState()
  }, [resetState])

  const openDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const selectCaptureMode = useCallback(
    (mode: 'camera' | 'file') => {
      setCaptureMode(mode)
      if (mode === 'camera') {
        startCamera()
      } else {
        fileInputRef.current?.click()
      }
    },
    [startCamera],
  )

  return (
    <div className="space-y-2 mt-2 mb-4">
      <div
        onClick={openDialog}
        className={cn(
          'relative h-40 w-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          'hover:border-primary hover:bg-accent/5',
          'flex items-center justify-center',
        )}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <span className="text-sm text-center px-2">Upload Image</span>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Capture a photo or choose an image from your files (max 5MB)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!captureMode && !previewUrl && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-32 flex flex-col gap-2"
                  onClick={() => selectCaptureMode('camera')}
                >
                  <Camera className="w-8 h-8" />
                  <span>Capture from Camera</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-32 flex flex-col gap-2"
                  onClick={() => selectCaptureMode('file')}
                >
                  <Upload className="w-8 h-8" />
                  <span>Choose from File</span>
                </Button>
              </div>
            )}

            {captureMode === 'camera' && !previewUrl && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={captureImage}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRetake}
                    disabled={isUploading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

ImageUpload.displayName = 'ImageUpload'
export default memo(ImageUpload)
