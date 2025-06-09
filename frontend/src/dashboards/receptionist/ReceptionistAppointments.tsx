// src/pages/receptionist/appointments.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Check, X, Search, AlertCircle, Filter, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAppointmentStore, type AppointmentData } from "@/store/receptionistAppointmentStore";

export default function ReceptionistAppointments() {
  const navigate = useNavigate();
  const {
    appointments,
    fetchAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
  } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "decline" | "re-approve" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  // Fetch appointments on mount
  useState(() => {
    fetchAppointments().catch((error) => {
      toast.error("Failed to load appointments");
      console.error(error);
    });
  });

  // Filter appointments based on status
  const pendingAppointments = appointments.filter(
    (appt) => appt.appointment.status === "PENDING"
  );

  const confirmedAppointments = appointments.filter(
    (appt) => appt.appointment.status === "BOOKED"
  );

  const rejectedAppointments = appointments.filter(
    (appt) => appt.appointment.status === "REJECTED"
  );

  const completedAppointments = appointments.filter(
    (appt) => appt.appointment.status === "DONE"
  );

  // Filter appointments based on search term
  const filterAppointments = (appointments: AppointmentData[]) => {
    return appointments.filter((appt) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        appt.patient.name.toLowerCase().includes(searchLower) ||
        appt.doctor.name.toLowerCase().includes(searchLower) ||
        appt.appointment.appointment_date.includes(searchTerm) ||
        appt.slot.slot_time.toLowerCase().includes(searchLower) ||
        appt.appointment.reason.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredPendingAppointments = filterAppointments(pendingAppointments);
  const filteredConfirmedAppointments = filterAppointments(confirmedAppointments);
  const filteredRejectedAppointments = filterAppointments(rejectedAppointments);
  const filteredCompletedAppointments = filterAppointments(completedAppointments);

  const handleApproveAppointment = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setDialogAction("approve");
  };

  const handleDeclineAppointment = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setDialogAction("decline");
  };

  const handleReapproveAppointment = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setDialogAction("re-approve");
  };

  const handleRescheduleAppointment = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(appointment.appointment.appointment_date);
    setShowRescheduleDialog(true);
  };

  const confirmReschedule = async () => {
    if (!selectedAppointment || !rescheduleDate) return;

    try {
      setIsProcessing(true);
      
      await rescheduleAppointment(selectedAppointment.appointment.id, rescheduleDate);
      
      // Update local state and set status to PENDING
      const updatedAppointments = appointments.map((appt) => {
        if (appt.appointment.id === selectedAppointment.appointment.id) {
          return {
            ...appt,
            appointment: {
              ...appt.appointment,
              reschedule_date: rescheduleDate,
              appointment_date: rescheduleDate,
              status: "PENDING", // Set status to PENDING after reschedule
            },
          };
        }
        return appt;
      });

      useAppointmentStore.setState({ appointments: updatedAppointments as AppointmentData[] });
      
      toast.success("Appointment rescheduled successfully and moved to PENDING");
      setShowRescheduleDialog(false);
      setSelectedAppointment(null);
      setRescheduleDate("");
    } catch (error) {
      toast.error("Failed to reschedule appointment");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAction = async () => {
    if (!selectedAppointment || !dialogAction) return;

    try {
      setIsProcessing(true);
      const action = dialogAction === "re-approve" ? "approve" : dialogAction;

      const response = await fetch("http://localhost:8000/receptionist/appointment/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: selectedAppointment.appointment.id,
          action,
        }),
      });

      if (!response.ok) throw new Error(`Failed to ${dialogAction} appointment`);

      // Update local state
      const newStatus = dialogAction === "approve" || dialogAction === "re-approve" 
        ? "BOOKED" 
        : "REJECTED";
      updateAppointmentStatus(selectedAppointment.appointment.id, newStatus);

      toast.success(`Appointment ${dialogAction === "re-approve" ? "re-approved" : dialogAction + "d"} successfully`);
    } catch (error) {
      toast.error(`Failed to ${dialogAction} appointment`);
      console.error(error);
    } finally {
      setIsProcessing(false);
      setDialogAction(null);
      setSelectedAppointment(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    const [start, end] = timeString.split('-');
    return `${start.substring(0, 5)} - ${end.substring(0, 5)}`;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";
    switch (status) {
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "BOOKED":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "DONE":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Appointments</h1>
          <Button variant="outline" onClick={() => fetchAppointments().catch(console.error)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  {pendingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Pending Appointments Tab */}
          <TabsContent value="pending" className="space-y-4">
            {filteredPendingAppointments.length > 0 ? (
              filteredPendingAppointments.map((appt) => (
                <Card key={appt.appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">
                              {appt.patient.name} with Dr. {appt.doctor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{appt.doctor.specialization}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              <span>{formatDate(appt.appointment.appointment_date)}</span>
                              <Clock className="ml-3 mr-1 h-4 w-4" />
                              <span>{formatTime(appt.slot.slot_time)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Reason: {appt.appointment.reason}</p>
                            <div className="flex items-center mt-1">
                              <span className={getStatusBadge(appt.appointment.status)}>
                                {appt.appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-64">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRescheduleAppointment(appt)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleApproveAppointment(appt)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeclineAppointment(appt)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Confirmed Appointments Tab */}
          <TabsContent value="confirmed" className="space-y-4">
            {filteredConfirmedAppointments.length > 0 ? (
              filteredConfirmedAppointments.map((appt) => (
                <Card key={appt.appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">
                              {appt.patient.name} with Dr. {appt.doctor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{appt.doctor.specialization}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              <span>{formatDate(appt.appointment.appointment_date)}</span>
                              <Clock className="ml-3 mr-1 h-4 w-4" />
                              <span>{formatTime(appt.slot.slot_time)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Reason: {appt.appointment.reason}</p>
                            <div className="flex items-center mt-1">
                              <span className={getStatusBadge(appt.appointment.status)}>
                                {appt.appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end bg-gray-50 p-4 md:w-32">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No confirmed appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Rejected Appointments Tab */}
          <TabsContent value="rejected" className="space-y-4">
            {filteredRejectedAppointments.length > 0 ? (
              filteredRejectedAppointments.map((appt) => (
                <Card key={appt.appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <X className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">
                              {appt.patient.name} with Dr. {appt.doctor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{appt.doctor.specialization}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              <span>{formatDate(appt.appointment.appointment_date)}</span>
                              <Clock className="ml-3 mr-1 h-4 w-4" />
                              <span>{formatTime(appt.slot.slot_time)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Reason: {appt.appointment.reason}</p>
                            <div className="flex items-center mt-1">
                              <span className={getStatusBadge(appt.appointment.status)}>
                                {appt.appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 bg-gray-50 p-4 md:w-48">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleReapproveAppointment(appt)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Re-approve
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No rejected appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Appointments Tab */}
          <TabsContent value="completed" className="space-y-4">
            {filteredCompletedAppointments.length > 0 ? (
              filteredCompletedAppointments.map((appt) => (
                <Card key={appt.appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <Check className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-medium">
                              {appt.patient.name} with Dr. {appt.doctor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{appt.doctor.specialization}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              <span>{formatDate(appt.appointment.appointment_date)}</span>
                              <Clock className="ml-3 mr-1 h-4 w-4" />
                              <span>{formatTime(appt.slot.slot_time)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Reason: {appt.appointment.reason}</p>
                            <div className="flex items-center mt-1">
                              <span className={getStatusBadge(appt.appointment.status)}>
                                {appt.appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end bg-gray-50 p-4 md:w-32">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No completed appointments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={!!dialogAction}
        onOpenChange={(open) => {
          if (!open) {
            setDialogAction(null);
            setSelectedAppointment(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" 
                ? "Approve Appointment" 
                : dialogAction === "re-approve" 
                ? "Re-approve Appointment" 
                : "Decline Appointment"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? "Are you sure you want to approve this appointment?"
                : dialogAction === "re-approve"
                ? "Are you sure you want to re-approve this rejected appointment?"
                : "Are you sure you want to decline this appointment?"}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4">
              <div className="rounded-md border p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Patient:</span>
                    <span className="text-sm">{selectedAppointment.patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Doctor:</span>
                    <span className="text-sm">Dr. {selectedAppointment.doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{formatDate(selectedAppointment.appointment.appointment_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Time:</span>
                    <span className="text-sm">{formatTime(selectedAppointment.slot.slot_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reason:</span>
                    <span className="text-sm">{selectedAppointment.appointment.reason}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null);
                setSelectedAppointment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "approve" || dialogAction === "re-approve" 
                  ? "default" 
                  : "destructive"
              }
              onClick={confirmAction}
              disabled={isProcessing}
            >
              {isProcessing 
                ? "Processing..." 
                : dialogAction === "approve" 
                ? "Approve" 
                : dialogAction === "re-approve"
                ? "Re-approve"
                : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date for this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Patient:</span>
                  <span className="text-sm">{selectedAppointment.patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Date:</span>
                  <span className="text-sm">
                    {formatDate(selectedAppointment.appointment.appointment_date)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Appointment Date</label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRescheduleDialog(false);
                setSelectedAppointment(null);
                setRescheduleDate("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReschedule}
              disabled={!rescheduleDate || isProcessing}
            >
              {isProcessing ? "Processing..." : "Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}