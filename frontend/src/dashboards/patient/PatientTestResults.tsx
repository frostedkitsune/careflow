import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCareFlowStore } from "@/lib/store"
import { Calendar, Download, Eye, FileText } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function PatientTestResults() {
  const navigate = useNavigate()
  const currentUser = useCareFlowStore((state) => state.currentUser)
  const testResults = useCareFlowStore((state) => state.testResults)
  const [selectedResult, setSelectedResult] = useState<any | null>(null)

  // Filter test results for the current patient
  const patientTestResults = currentUser ? testResults.filter((result) => result.patientId === currentUser.id) : []

  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Test Results</h1>
        </div>

        {patientTestResults.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patientTestResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{result.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {result.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Type:</span>
                    <span>{result.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Uploaded by:</span>
                    <span>{result.uploadedBy}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedResult(result)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
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
              <p className="text-muted-foreground mb-2">You have no test results available</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                When your healthcare provider uploads test results, they will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedResult?.name}</DialogTitle>
            <DialogDescription>Test results from {selectedResult?.date}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Test Type</h4>
                <p className="text-sm text-muted-foreground">{selectedResult?.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Date</h4>
                <p className="text-sm text-muted-foreground">{selectedResult?.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">{selectedResult?.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Uploaded By</h4>
                <p className="text-sm text-muted-foreground">{selectedResult?.uploadedBy}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Results</h4>
              <div className="rounded-md border p-4 text-sm">{selectedResult?.results}</div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
