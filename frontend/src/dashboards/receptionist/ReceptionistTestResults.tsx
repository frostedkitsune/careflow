import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, Search, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { useCareFlowStore } from "@/lib/store"
import { patients, getPatientById } from "@/lib/data"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export default function ReceptionistTestResults() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const testResults = useCareFlowStore((state) => state.testResults)
  const addTestResult = useCareFlowStore((state) => state.addTestResult)

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [patientId, setPatientId] = useState("")
  const [testName, setTestName] = useState("")
  const [testType, setTestType] = useState("")
  const [testResultText, setTestResultText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Filter test results based on search term
  const filteredTestResults = testResults.filter((result) => {
    const patient = getPatientById(result.patientId)

    return (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.date.includes(searchTerm)
    )
  })

  // Group test results by date (recent first)
  const sortedTestResults = [...filteredTestResults].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!patientId || !testName || !testType || !testResultText) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      // Create new test result
      const newTestResult = {
        patientId: Number.parseInt(patientId),
        name: testName,
        date: new Date().toISOString().split("T")[0],
        status: "Available",
        type: testType,
        uploadedBy: currentUser ? "Sarah Johnson" : "Unknown",
        results: testResultText,
      }

      // Add test result to store
      addTestResult(newTestResult)

      // Reset form
      setPatientId("")
      setTestName("")
      setTestType("")
      setTestResultText("")
      setFile(null)
      setIsUploading(false)
      setUploadDialogOpen(false)

      // Show success message
      toast("Test results uploaded",{
        description: "The test results have been successfully uploaded.",
      })
    }, 1500)
  }

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Test Results</h1>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Test Results
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search test results..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Results</TabsTrigger>
            <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {sortedTestResults.length > 0 ? (
              <div className="space-y-4">
                {sortedTestResults.map((result) => {
                  const patient = getPatientById(result.patientId)

                  return (
                    <Card key={result.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-medium">{result.name}</h3>
                                <p className="text-sm text-muted-foreground">Patient: {patient?.name}</p>
                                <p className="text-sm text-muted-foreground">Type: {result.type}</p>
                                <p className="text-sm text-muted-foreground">Date: {result.date}</p>
                                <p className="text-sm text-muted-foreground">Uploaded by: {result.uploadedBy}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No test results found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {sortedTestResults.length > 0 ? (
              <div className="space-y-4">
                {sortedTestResults.slice(0, 5).map((result) => {
                  const patient = getPatientById(result.patientId)

                  return (
                    <Card key={result.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-1 p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-medium">{result.name}</h3>
                                <p className="text-sm text-muted-foreground">Patient: {patient?.name}</p>
                                <p className="text-sm text-muted-foreground">Type: {result.type}</p>
                                <p className="text-sm text-muted-foreground">Date: {result.date}</p>
                                <p className="text-sm text-muted-foreground">Uploaded by: {result.uploadedBy}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No recent test results found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Test Results</DialogTitle>
            <DialogDescription>
              Upload test results for a patient. Fill in all the required information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., Blood Test Results, X-Ray Results"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select value={testType} onValueChange={setTestType}>
                <SelectTrigger id="testType">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blood Test">Blood Test</SelectItem>
                  <SelectItem value="X-Ray">X-Ray</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="CT Scan">CT Scan</SelectItem>
                  <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                  <SelectItem value="ECG">ECG</SelectItem>
                  <SelectItem value="Allergy Test">Allergy Test</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testResults">Test Results</Label>
              <Textarea
                id="testResults"
                value={testResultText}
                onChange={(e) => setTestResultText(e.target.value)}
                placeholder="Enter the test results here"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Attach File (Optional)</Label>
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
                {isUploading ? "Uploading..." : "Upload Results"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
