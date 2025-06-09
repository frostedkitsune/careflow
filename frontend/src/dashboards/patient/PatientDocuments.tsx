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
import { Calendar, Download, File, FileText, Upload, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export default function PatientDocuments() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const documents = useCareFlowStore((state) => state.documents)
  const addDocument = useCareFlowStore((state) => state.addDocument)
  const deleteDocument = useCareFlowStore((state) => state.deleteDocument)

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null)
  const [reason, setReason] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Filter documents for the current patient
  const patientDocuments = currentUser ? documents.filter((document) => document.patientId === currentUser.id) : []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason || !file) {
      toast.error("Missing information", {
        description: "Please provide a reason and select a file.",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      // Create new document
      const newDocument = {
        patientId: currentUser?.id || 0,
        name: file.name,
        date: new Date().toISOString().split("T")[0],
        type: "Uploaded Document",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      }

      // Add document to store
      addDocument(newDocument)

      // Reset form
      setReason("")
      setFile(null)
      setIsUploading(false)
      setUploadDialogOpen(false)

      // Show success message
      toast("Document uploaded", {
        description: "Your document has been successfully uploaded.",
      })
    }, 1500)
  }

  const handleDeleteDocument = (id: number) => {
    setDocumentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete)
      setDeleteDialogOpen(false)
      setDocumentToDelete(null)

      toast("Document deleted", {
        description: "Your document has been successfully deleted.",
      })
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
          <h1 className="text-2xl font-bold tracking-tight">My Documents</h1>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {patientDocuments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientDocuments.map((document) => (
              <Card key={document.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-start">
                    <File className="h-5 w-5 mr-2 flex-shrink-0 text-teal-600" />
                    <span className="truncate">{document.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {document.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Type:</span>
                    <span>{document.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Size:</span>
                    <span>{document.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteDocument(document.id)}
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
              <p className="text-muted-foreground mb-2">You have no documents uploaded</p>
              <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload medical documents to share with your healthcare providers.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for uploading this document"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
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
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDocument}>
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}