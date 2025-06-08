import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const frequencies = ["30"];

function generateTimeSlots(frequency: number): string[] {
  const start = 9 * 60; // 9:00 AM
  const end = 17 * 60; // 5:00 PM
  const slots: string[] = [];

  for (let time = start; time + frequency <= end; time += frequency) {
    const fromHour = Math.floor(time / 60);
    const fromMin = time % 60;
    const toHour = Math.floor((time + frequency) / 60);
    const toMin = (time + frequency) % 60;

    const format = (h: number, m: number) =>
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    slots.push(`${format(fromHour, fromMin)} - ${format(toHour, toMin)}`);
  }

  return slots;
}

function splitSlots(slots: string[]) {
  const morningSlots: string[] = [];
  const afternoonSlots: string[] = [];
  const noon = 12 * 60; // 12:00 PM in minutes

  slots.forEach(slot => {
    const [startTime] = slot.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes < noon) {
      morningSlots.push(slot);
    } else {
      afternoonSlots.push(slot);
    }
  });

  return { morningSlots, afternoonSlots };
}

function formatApiTimeToDisplay(apiTime: string): string {
  // Convert "09:00:00-09:30:00" to "09:00 - 09:30"
  const [start, end] = apiTime.split('-');
  const formatPart = (part: string) => part.split(':').slice(0, 2).join(':');
  return `${formatPart(start)} - ${formatPart(end)}`;
}

function formatDisplayTimeToApi(time: string): string {
  // Convert "09:00 - 09:30" to "09:00:00-09:30:00"
  const [start, end] = time.split(' - ');
  return `${start}:00-${end}:00`;
}

export default function ReceptionistSlotsManager() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [frequency, setFrequency] = useState("30");
  const [selectedSlots, setSelectedSlots] = useState<Record<string, Set<string>>>({});
  const [originalSlots, setOriginalSlots] = useState<string[]>([]);
  const [slotData, setSlotData] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate()
  const [btnLoading,setBtnLoading] = useState<boolean>(false);

  const timeSlotsPerDay = useMemo(() => {
    const freq = parseInt(frequency);
    const slotsPerDay: Record<string, { morning: string[], afternoon: string[] }> = {};
    for (const day of days) {
      const allSlots = generateTimeSlots(freq);
      const { morningSlots, afternoonSlots } = splitSlots(allSlots);
      slotsPerDay[day] = { morning: morningSlots, afternoon: afternoonSlots };
    }
    return slotsPerDay;
  }, [frequency]);

  useEffect(() => {
    const fetchDoctorSlots = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/receptionist/doctor/slots/${doctorId}`);
        if (!response.ok) throw new Error("Failed to fetch slots");

        const data = await response.json();

        // fetch the doctor name
        const storedData = localStorage.getItem('doctor-storage');
        if (storedData) {
          const doctorInfo = JSON.parse(storedData);
          const doctor = doctorInfo.state.doctors.find((doc: { id: any; }) => doc.id === data.doctor_id);
          setDoctorName(`${doctor.name}`);
        }
        setSlotData(data.slots);

        const initialSelected: Record<string, Set<string>> = {};
        const original: string[] = [];

        data.slots.forEach((slot: any) => {
          const day = slot.day.toUpperCase();
          const displayTime = formatApiTimeToDisplay(slot.slot_time);

          if (slot.available) {
            if (!initialSelected[day]) initialSelected[day] = new Set();
            initialSelected[day].add(displayTime);
            original.push(`${day}:${displayTime}`);
          }
        });

        setSelectedSlots(initialSelected);
        setOriginalSlots(original);
      } catch (error) {
        toast.error("Failed to load doctor slots");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorSlots();
  }, [doctorId]);

  const toggleSlot = (day: string, time: string) => {
    const newSelected = { ...selectedSlots };
    if (!newSelected[day]) newSelected[day] = new Set();

    if (newSelected[day].has(time)) {
      newSelected[day].delete(time);
    } else {
      newSelected[day].add(time);
    }

    setSelectedSlots(newSelected);

    const newSelectedFlat = Object.entries(newSelected)
      .flatMap(([d, times]) => Array.from(times).map((t) => `${d}:${t}`));

    const hasChange = newSelectedFlat.length !== originalSlots.length ||
      !newSelectedFlat.every((s) => originalSlots.includes(s));

    setHasChanges(hasChange);
  };

  const isSlotSelected = (day: string, time: string) =>
    selectedSlots[day]?.has(time);

  const saveChanges = async () => {
    try {
      setBtnLoading(true);

      const payload = [];

      // 1. Handle existing slots (updates)
      for (const slot of slotData) {
        const day = slot.day.toUpperCase();
        const displayTime = formatApiTimeToDisplay(slot.slot_time);
        const shouldBeAvailable = selectedSlots[day]?.has(displayTime) ?? false;

        if (slot.available !== shouldBeAvailable) {
          payload.push({
            id: slot.id,
            available: shouldBeAvailable
          });
        }
      }

      // 2. Handle new slots (creates)
      const allExistingSlots = new Set(
        slotData.map(s => `${s.day.toUpperCase()}:${formatApiTimeToDisplay(s.slot_time)}`)
      );

      for (const [day, times] of Object.entries(selectedSlots)) {
        for (const displayTime of Array.from(times)) {
          const slotKey = `${day}:${displayTime}`;
          if (!allExistingSlots.has(slotKey)) {
            payload.push({
              day,
              slot_time: formatDisplayTimeToApi(displayTime),
              available: true
            });
          }
        }
      }

      const response = await fetch(`http://localhost:8000/receptionist/doctor/slots/${doctorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update slots");

      // Refresh data
      const updatedData = await response.json();
      setSlotData(updatedData.slots);

      const newOriginal: string[] = [];
      const newSelected: Record<string, Set<string>> = {};

      updatedData.slots.forEach((slot: any) => {
        const day = slot.day.toUpperCase();
        const displayTime = formatApiTimeToDisplay(slot.slot_time);

        if (slot.available) {
          if (!newSelected[day]) newSelected[day] = new Set();
          newSelected[day].add(displayTime);
          newOriginal.push(`${day}:${displayTime}`);
        }
      });

      setOriginalSlots(newOriginal);
      setSelectedSlots(newSelected);
      setHasChanges(false);

      toast.success("Slots updated successfully!");
    } catch (error) {
      toast.error("Failed to update slots");
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="receptionist">
        <div className="flex justify-center items-center h-64">
          <p>Loading slots...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4 relative">
        <div className="flex items-center justify-start gap-5">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{doctorName}</h1>
          <div className="flex flex-row gap-4 absolute right-0">
            {/* <label htmlFor="frequency" className="pt-1">
              Select frequency
            </label>
            <Select
              value={frequency}
              onValueChange={(value) => {
                setFrequency(value);
                setHasChanges(true);
              }}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>

        <Tabs defaultValue="MON" className="space-y-4">
          <TabsList>
            {days.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="w-full">
                <h2 className="block">Available Slots</h2>
                <Separator className="mt-2 mb-4" />

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-2">Morning Slots</h3>
                  <div className="flex flex-wrap gap-4">
                    {timeSlotsPerDay[day].morning.map((time) => {
                      const isSelected = isSlotSelected(day, time);
                      return (
                        <Button
                          key={time}
                          onClick={() => toggleSlot(day, time)}
                          className={`py-6 w-[200px] flex justify-start ${isSelected
                            ? "bg-green-200 hover:bg-green-300"
                            : "bg-gray-50 hover:bg-gray-100"
                            } text-black border shadow-sm`}
                        >
                          <Clock />
                          <span className="inline-block w-full text-left pl-2 pb-1">
                            {time}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Afternoon Slots</h3>
                  <div className="flex flex-wrap gap-4">
                    {timeSlotsPerDay[day].afternoon.map((time) => {
                      const isSelected = isSlotSelected(day, time);
                      return (
                        <Button
                          key={time}
                          onClick={() => toggleSlot(day, time)}
                          className={`py-6 w-[200px] flex justify-start ${isSelected
                            ? "bg-green-200 hover:bg-green-300"
                            : "bg-gray-50 hover:bg-gray-100"
                            } text-black border shadow-sm`}
                        >
                          <Clock />
                          <span className="inline-block w-full text-left pl-2 pb-1">
                            {time}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Button
          onClick={saveChanges}
          disabled={!hasChanges || isLoading}
          className="bg-primary"
        >
          {btnLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </DashboardLayout>
  );
}