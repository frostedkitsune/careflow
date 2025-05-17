import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill, Search, Printer } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { useCareFlowStore } from "@/lib/store";
import { useNavigate } from "react-router";
import { type PrescriptionData } from "@/lib/types";

export default function DoctorPrescriptions() {
  const navigate = useNavigate();
  const currentUser = useCareFlowStore((state) => state.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/prescription/all");
        if (!response.ok) throw new Error("Failed to fetch prescriptions");
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError("Failed to load prescriptions");
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handlePrint = (prescription: PrescriptionData) => {
    console.log("Printing prescription:", prescription);
    // In a real app, you would implement actual printing logic here
    alert(`Printing prescription for ${prescription.patient.name}\nMedication: ${prescription.prescription.medication}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter((data) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      data.patient.name.toLowerCase().includes(searchLower) ||
      data.prescription.medication.toLowerCase().includes(searchLower) ||
      data.prescription.test.toLowerCase().includes(searchLower) ||
      data.prescription.observation.toLowerCase().includes(searchLower)
    );
  });

  // Sort prescriptions by date (recent first)
  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    return new Date(b.prescription.id).getTime() - new Date(a.prescription.id).getTime();
  });

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prescriptions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : sortedPrescriptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedPrescriptions.map((data) => (
              <Card key={data.prescription.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                          <Pill className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Patient</p>
                              <p className="font-medium">{data.patient.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Medication</p>
                              <p>{data.prescription.medication}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Advice</p>
                              <p>{data.prescription.advise}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Observation</p>
                              <p>{data.prescription.observation}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Test</p>
                              <p>{data.prescription.test}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Date</p>
                              <p>{formatDate(data.patient.dob)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end bg-gray-50 p-4 md:w-48">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePrint(data)}
                        className="gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Pill className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prescriptions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}