import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Calendar, Pill, ArrowLeft, Stethoscope, ClipboardList, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/dashboard-layout";
import { useCareFlowStore } from "@/lib/store";
import { useAppointmentStore } from "@/store/appointmentStore";
import { type PrescriptionData, type RecordData } from "@/lib/types";
import { toast } from "sonner"

const DoctorAppointmentsDetails = () => {
    const { appointment_id } = useParams();
    const navigate = useNavigate();
    const currentUser = useCareFlowStore((state) => state.currentUser);
    const { appointments, setAppointments } = useAppointmentStore();
    const [activeTab, setActiveTab] = useState("overview");
    const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
    const [record, setRecord] = useState<RecordData | null>(null);
    const [loading, setLoading] = useState({
        prescription: false,
        record: false
    });
    const [error, setError] = useState({
        prescription: "",
        record: ""
    });
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        medication: "",
        observation: "",
        advise: "",
        test: ""
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("http://localhost:8000/doctor/appointments")
                const data = await res.json()
                setAppointments(data)
            } catch (error) {
                console.error("Error fetching appointments:", error)
            }
        }

        fetchAppointments()
    }, [setAppointments])
    // Find the current appointment
    const appointment = appointments.find(a => a.appointment.id.toString() === appointment_id);

    useEffect(() => {
        if (!appointment) return;

        const fetchPrescription = async () => {
            try {
                setLoading(prev => ({ ...prev, prescription: true }));
                const response = await fetch(`http://localhost:8000/prescription/${appointment_id}`);
                if (!response.ok) throw new Error("Failed to fetch prescription");
                const data = await response.json();
                setPrescription(data);
                setError(prev => ({ ...prev, prescription: "" }));
            } catch (err: any) {
                setError(prev => ({ ...prev, prescription: err.message }));
                console.error("Error fetching prescription:", err);
            } finally {
                setLoading(prev => ({ ...prev, prescription: false }));
            }
        };

        const fetchRecord = async () => {
            try {
                setLoading(prev => ({ ...prev, record: true }));
                const response = await fetch(
                    `http://localhost:8000/doctor/record/${appointment.patient.id}/${appointment.appointment.id}`
                );
                if (!response.ok) throw new Error("Failed to fetch medical record");
                const data = await response.json();
                setRecord(data);
                setError(prev => ({ ...prev, record: "" }));
            } catch (err: any) {
                setError(prev => ({ ...prev, record: err.message }));
                console.error("Error fetching medical record:", err);
            } finally {
                setLoading(prev => ({ ...prev, record: false }));
            }
        };

        if (activeTab === "prescriptions") {
            fetchPrescription();
        } else if (activeTab === "records") {
            fetchRecord();
        }
    }, [activeTab, appointment_id, appointment]);

    const handleCreatePrescription = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {

            const response = await fetch("http://localhost:8000/prescription/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    appointment_id: +appointment_id!,
                    // patient_id: appointment?.patient.id
                }),
            });

            if (!response.ok) throw new Error("Failed to create prescription");

            const data = await response.json();
            setPrescription(data);
            setIsPrescriptionDialogOpen(false);
            setFormData({
                medication: "",
                observation: "",
                advise: "",
                test: ""
            });
            toast.success("Prescription created successfully")
            navigate(0);
        } catch (err: any) {
            toast.error("Prescription created failed")
            console.error("Error creating prescription:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!currentUser) {
        navigate("/login");
        return null;
    }

    if (!appointment) {
        return (
            <DashboardLayout role="doctor">
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium text-muted-foreground">
                        Appointment not found
                    </p>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go back
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DashboardLayout role="doctor">
            <div className="space-y-6">
                <div className="flex items-center justify-start">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold ml-6">Appointment Details</h1>
                    <div></div> {/* Spacer */}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6">
                        <TabsTrigger value="overview">Patient</TabsTrigger>
                        <TabsTrigger value="appointment">Appointment</TabsTrigger>
                        <TabsTrigger value="prescriptions">Prescription</TabsTrigger>
                        <TabsTrigger value="records">Record</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5" />
                                    Patient Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                        <p className="text-sm">
                                            {appointment.patient.name}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                        <p className="text-sm">
                                            {formatDate(appointment.patient.dob)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Gender</p>
                                        <p className="text-sm capitalize">
                                            {appointment.patient.gender}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Contact</p>
                                        <p className="text-sm">
                                            {appointment.patient.phone}
                                        </p>
                                        <p className="text-sm">
                                            {appointment.patient.email}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                                        <p className="text-sm">
                                            {appointment.patient.emergency_person} ({appointment.patient.emergency_relation})
                                        </p>
                                        <p className="text-sm">
                                            {appointment.patient.emergency_number}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appointment" className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5" />
                                    Appointment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Date</p>
                                        <p className="text-sm">
                                            {formatDate(appointment.appointment.appointment_date)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                        <p className="text-sm">
                                            {formatTime(appointment.slot.slot_time)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <p className="text-sm capitalize">
                                            {appointment.appointment.status.toLowerCase()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Day</p>
                                        <p className="text-sm">
                                            {appointment.slot.day}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Reason</p>
                                    <p className="text-sm">
                                        {appointment.appointment.reason}
                                    </p>
                                </div>
                                {appointment.appointment.reschedule_date && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Rescheduled Date</p>
                                        <p className="text-sm">
                                            {formatDate(appointment.appointment.reschedule_date)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="prescriptions" className="space-y-6">
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setIsPrescriptionDialogOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Prescription
                            </Button>
                        </div>

                        {loading.prescription ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                            </div>
                        ) : error.prescription ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-10">
                                    <p className="text-red-500">{error.prescription}</p>
                                </CardContent>
                            </Card>
                        ) : prescription ? (
                            <Card className="border-none shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Pill className="h-5 w-5" />
                                        Prescription Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Observation</p>
                                        <p className="text-sm">
                                            {prescription.prescription.observation}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Medication</p>
                                            <p className="text-sm">
                                                {prescription.prescription.medication}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-500">Test Recommended</p>
                                            <p className="text-sm">
                                                {prescription.prescription.test}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Advice</p>
                                        <p className="text-sm">
                                            {prescription.prescription.advise}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Pill className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No prescription found</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="records" className="space-y-6">
                        {loading.record ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                            </div>
                        ) : error.record ? (
                            <Card>
                                <CardContent className="flex items-center justify-center py-10">
                                    <p className="text-red-500">{error.record}</p>
                                </CardContent>
                            </Card>
                        ) : record ? (
                            <Card className="border-none shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ClipboardList className="h-5 w-5" />
                                        Medical Record
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Reason</p>
                                        <p className="text-sm">
                                            {record.reason}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Record Data</p>
                                        <p className="text-sm">
                                            {record.record_data}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-sm">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Stethoscope className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No medical record found</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create Prescription Dialog */}
            <Dialog open={isPrescriptionDialogOpen} onOpenChange={setIsPrescriptionDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Prescription</DialogTitle>
                        <DialogDescription>
                            Create a new prescription for {appointment?.patient.name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePrescription} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="observation">Observation</Label>
                            <Textarea
                                id="observation"
                                name="observation"
                                value={formData.observation}
                                onChange={handleInputChange}
                                placeholder="Patient's symptoms and observations"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="medication">Medication</Label>
                            <Textarea
                                id="medication"
                                name="medication"
                                value={formData.medication}
                                onChange={handleInputChange}
                                placeholder="Prescribed medications and dosage"
                                rows={3}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="advise">Advice</Label>
                            <Textarea
                                id="advise"
                                name="advise"
                                value={formData.advise}
                                onChange={handleInputChange}
                                placeholder="Additional advice for the patient"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="test">Recommended Tests</Label>
                            <Textarea
                                id="test"
                                name="test"
                                value={formData.test}
                                onChange={handleInputChange}
                                placeholder="Any recommended medical tests"
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPrescriptionDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Create Prescription"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default DoctorAppointmentsDetails;