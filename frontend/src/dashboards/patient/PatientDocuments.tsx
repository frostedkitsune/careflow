import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCareFlowStore } from "@/lib/store"
import { Calendar, Download, ExternalLink, File, FileText, RefreshCw, Shield, ShieldCheck, Upload, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

interface PatientRecord {
  id: number;
  reason: string;
  record_data: string;
  created_at?: string;
}

export default function PatientDocuments() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null)
  const [reason, setReason] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch patient records
  useEffect(() => {
    if (currentUser) {
      fetchPatientRecords()
    }
  }, [currentUser])

  const fetchPatientRecords = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/patient/record", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }

      const data = await response.json()
      setPatientRecords(data)
    } catch (error) {
      toast.error("Error fetching records", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason || !file) {
      toast.error("Missing information", {
        description: "Please provide a reason and select a file.",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("reason", reason)
      formData.append("file", file)

      const response = await fetch("http://localhost:8000/patient/record", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      // Refresh the records list
      await fetchPatientRecords()

      // Reset form
      setReason("")
      setFile(null)
      setUploadDialogOpen(false)

      // Show success message
      toast.success("Document uploaded", {
        description: "Your document has been successfully uploaded.",
      })
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteRecord = (id: number) => {
    setRecordToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return

    try {
      const response = await fetch(`http://localhost:8000/patient/record/${recordToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete record")
      }

      // Refresh the records list
      await fetchPatientRecords()
      setDeleteDialogOpen(false)
      setRecordToDelete(null)

      toast.success("Record deleted", {
        description: "Your record has been successfully deleted.",
      })
    } catch (error) {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      const fileName = pathname.split('/').pop() || "document.pdf"
      // Truncate long file names
      return fileName.length > 20 ? `${fileName.substring(0, 15)}...${fileName.split('.').pop()}` : fileName
    } catch {
      return "document.pdf"
    }
  }

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return 'PDF'
      case 'jpg':
      case 'jpeg':
      case 'png': return 'Image'
      case 'doc':
      case 'docx': return 'Word Document'
      default: return 'File'
    }
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Medical Records</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchPatientRecords}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Record
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : patientRecords.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-start">
                    <File className="h-5 w-5 mr-2 flex-shrink-0 text-teal-600" />
                    <span className="truncate" title={getFileNameFromUrl(record.record_data)}>
                      {getFileNameFromUrl(record.record_data)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Type:</span>
                    <span>{getFileType(record.record_data)}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Reason:</span>
                    <p className="line-clamp-2" title={record.reason}>{record.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(record.record_data, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">You have no medical records uploaded</p>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Record
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-sm text-green-600 pt-8 pb-4 flex flex-row justify-center gap-2">
          <p>All data is end-to-end encrypted</p>
          <ShieldCheck color="#36c987" />
        </div>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Record</DialogTitle>
            <DialogDescription>Upload medical records to share with your healthcare providers.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for uploading this record"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                </label>
              </div>
              {file && (
                <div className="text-sm text-muted-foreground mt-2">
                  Selected file: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medical Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medical record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRecord}>
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}