import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCareFlowStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Loader2, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { create } from "zustand";

// New Zustand store for slots
interface SlotStore {
  slotsData: DoctorWithSlots[];
  setSlotsData: (data: DoctorWithSlots[]) => void;
  isLoadingSlots: boolean;
  setIsLoadingSlots: (loading: boolean) => void;
  fetchSlots: () => Promise<void>;
}

export const useSlotStore = create<SlotStore>((set) => ({
  slotsData: [],
  isLoadingSlots: false,
  setSlotsData: (data) => set({ slotsData: data }),
  setIsLoadingSlots: (loading) => set({ isLoadingSlots: loading }),
  fetchSlots: async () => {
    set({ isLoadingSlots: true });
    try {
      const response = await fetch("http://localhost:8000/patient/slots");
      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }
      const data = await response.json();
      set({ slotsData: data.data });
    } catch (error) {
      toast.error("Error loading slots", {
        description: error instanceof Error ? error.message : "Failed to fetch slots",
      });
    } finally {
      set({ isLoadingSlots: false });
    }
  },
}));

// Custom MultiSelect Component
interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  loading?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select an option",
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabels = selected
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="w-full justify-between"
        disabled={loading}
      >
        {selectedLabels.length > 0
          ? selectedLabels.join(", ")
          : placeholder}
        {loading ? (
          <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        )}
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md mt-1">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleOptionClick(option.value)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  readOnly
                  className="mr-2"
                />
                {option.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">No options available.</div>
          )}
        </div>
      )}
    </div>
  );
};

// End Custom MultiSelect Component

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Slot {
  id: number;
  available: boolean;
  day: string;
  slot_time: string;
}

interface DoctorWithSlots {
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  slots: Slot[];
}

interface MedicalRecord {
  id: number;
  reason: string;
  record_data: string;
  created_at: string;
}

export default function PatientNewAppointment() {
  const navigate = useNavigate();
  const currentUser = useCareFlowStore((state) => state.currentUser);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { slotsData, isLoadingSlots, fetchSlots } = useSlotStore(); // Using Zustand for slots
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    undefined
  );
  const [reason, setReason] = useState<string>("");
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const response = await fetch("http://localhost:8000/patient/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Error loading doctors", {
          description: error instanceof Error ? error.message : "Failed to fetch doctors",
        });
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch slots when doctor is selected or if slotsData is empty
  useEffect(() => {
    if (selectedDoctor && slotsData.length === 0) {
      fetchSlots();
    }
  }, [selectedDoctor, slotsData.length, fetchSlots]);

  // Fetch medical records
  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoadingRecords(true);
      try {
        const response = await fetch("http://localhost:8000/patient/record");
        if (!response.ok) {
          throw new Error("Failed to fetch medical records");
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        toast.error("Error loading records", {
          description: error instanceof Error ? error.message : "Failed to fetch records",
        });
      } finally {
        setIsLoadingRecords(false);
      }
    };

    fetchRecords();
  }, []);

  // Get available slots for selected doctor
  const getAvailableSlots = () => {
    if (!selectedDoctor || !slotsData.length) return [];

    const doctorSlots = slotsData.find(
      (d) => d.doctor_id === parseInt(selectedDoctor)
    );
    if (!doctorSlots) return [];

    return doctorSlots.slots
      .filter((slot) => slot.available)
      .map((slot) => ({
        value: slot.id.toString(),
        label: `${slot.day} - ${formatSlotTime(slot.slot_time)}`,
      }));
  };

  // Format slot time for display
  const formatSlotTime = (timeString: string) => {
    // Handle different time formats from API
    if (timeString.includes("-")) {
      const [start, end] = timeString.split("-");
      return `${formatTime(start)} - ${formatTime(end)}`;
    }
    return formatTime(timeString);
  };

  const formatTime = (timeStr: string) => {
    // Remove seconds if present
    const timeWithoutSeconds = timeStr.split(":").slice(0, 2).join(":");
    return new Date(`2000-01-01T${timeWithoutSeconds}`).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedSlot || !appointmentDate || !reason) {
      toast.error("Missing information", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/patient/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctor_id: parseInt(selectedDoctor),
          slot_id: parseInt(selectedSlot),
          appointment_date: format(appointmentDate, "yyyy-MM-dd"),
          reason: reason,
          record_ids: selectedRecords,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      toast.success("Appointment requested", {
        description: "Your appointment request has been submitted successfully.",
      });

      // Redirect to appointments page
      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1500);
    } catch (error) {
      toast.error("Booking failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <DashboardLayout role="patient">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          Book New Appointment
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Please fill in the details below to request an appointment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor *</Label>
                <Select
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  disabled={isLoadingDoctors}
                >
                  <SelectTrigger id="doctor">
                    {isLoadingDoctors ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading doctors...
                      </div>
                    ) : (
                      <SelectValue placeholder="Select a doctor" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{doctor.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {doctor.specialization}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDoctor && (
                <div className="space-y-2">
                  <Label htmlFor="slot">Available Time Slots *</Label>
                  <Select
                    value={selectedSlot}
                    onValueChange={setSelectedSlot}
                    disabled={isLoadingSlots || !selectedDoctor}
                  >
                    <SelectTrigger id="slot">
                      {isLoadingSlots ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading slots...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select a time slot" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSlots().length > 0 ? (
                        getAvailableSlots().map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground p-2">
                          No available slots for selected doctor
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !appointmentDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointmentDate ? format(appointmentDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={appointmentDate}
                      onSelect={setAppointmentDate}
                      initialFocus
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="records">Attach Medical Records (Optional)</Label>
                <MultiSelect
                  options={records.map((record) => ({
                    value: record.id.toString(),
                    label: `${record.reason} (${new Date(
                      record.created_at
                    ).toLocaleDateString()})`,
                  }))}
                  selected={selectedRecords.map(String)}
                  onChange={(values) => setSelectedRecords(values.map(Number))}
                  placeholder="Select records to attach"
                  loading={isLoadingRecords}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Appointment *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe the reason for your appointment"
                  className="min-h-[100px]"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/patient/appointments")}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !selectedDoctor ||
                !selectedSlot ||
                !appointmentDate ||
                !reason
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Appointment"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}