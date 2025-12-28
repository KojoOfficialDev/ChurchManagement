import { useCallback, useRef, useState } from 'react'
import { Download, FileSpreadsheet, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
]
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls']

type BulkUploadDialogProps = {
  entityName: string
  templatePath: string
  onUpload: (file: File) => Promise<void>
  isPending?: boolean
  trigger?: React.ReactNode
}

export const BulkUploadDialog = ({
  entityName,
  templatePath,
  onUpload,
  isPending = false,
  trigger,
}: BulkUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
    const isValidType =
      ACCEPTED_FILE_TYPES.includes(file.type) ||
      ACCEPTED_EXTENSIONS.includes(fileExtension)

    if (!isValidType) {
      return 'Invalid file type. Please upload an Excel file (.xlsx or .xls)'
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit'
    }

    return null
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
    },
    [validateFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect],
  )

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    try {
      await onUpload(selectedFile)
      setSelectedFile(null)
      setIsOpen(false)
    } catch {
      // Error handling is done in the mutation
    }
  }, [selectedFile, onUpload])

  const handleDownloadTemplate = useCallback(() => {
    const link = document.createElement('a')
    link.href = templatePath
    link.download = templatePath.split('/').pop() || 'template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Template downloaded successfully')
  }, [templatePath])

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSelectedFile(null)
      setError(null)
    }
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="default">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload {entityName}</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple {entityName.toLowerCase()}{' '}
            records at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template Button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleDownloadTemplate}
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          {/* Drop Zone */}
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
              error && 'border-destructive',
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports .xlsx, .xls (max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 ">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isPending}>
            {isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
