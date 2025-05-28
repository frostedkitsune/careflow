import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { doctors } from "@/lib/data"
import { useCareFlowStore } from "@/lib/store"
import { Clock, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export default function ReceptionistSlotsManager() {
  const navigate = useNavigate();
  const currentUser = useCareFlowStore((state) => state.currentUser);
  const [frequency, setFrequency] = useState("15");

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const frequencies = ["15", "30", "60"];

  const slotData = [
    {
      time: "10:00 - 10:30",
      day: "MON"
    },
    {
      time: "11:00 - 11:30",
      day: "MON"
    },
    {
      time: "11:00 - 11:30",
      day: "MON"
    },
    {
      time: "11:00 - 11:30",
      day: "MON"
    },
    {
      time: "11:00 - 11:30",
      day: "MON"
    },
    {
      time: "14:00 - 14:30",
      day: "TUE"
    },
    {
      time: "15:00 - 15:30",
      day: "TUE"
    },
    {
      time: "09:30 - 10:00",
      day: "WED"
    },
  ];

  useEffect(() => {
    // this should come from db
    setFrequency("30");
  }, [])


  if (!currentUser) {
    navigate("/login")
    return null
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{doctors[0].name}</h1>
          <div className="flex flex-row gap-4">
            <label htmlFor="frequency" className="pt-1">Select frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>


        <Tabs defaultValue="MON" className="space-y-4">
          <TabsList>
            {
              days.map((day) => (
                <TabsTrigger value={day} className="">{day}</TabsTrigger>
              ))
            }
          </TabsList>

          {
            days.map((day) => (
              <TabsContent value={day} className="">
                <div className="w-full">
                  <h2 className="block">Morning Slots</h2>
                  <Separator className="mt-2 mb-4" />
                  <div className="flex flex-row flex-wrap gap-4">
                    {

                      slotData.map(slot => {
                        if (slot.day == day)
                          return (<Button className="py-6 w-[200px] flex justify-start bg-gray-50 hover:bg-gray-50 text-black border shadow-sm">
                            <Clock />
                            <span className="inline-block w-full text-left pl-2 pb-1">{slot.time}</span>
                            <span className="h-8 w-8 p-2 hover:bg-destructive/20 rounded-full">
                              <Trash2 className="text-destructive" />
                            </span>
                          </Button>)
                        return (<></>)
                      })
                    }
                  </div>
                </div>

                {/* <div className="w-full">
                  <h2 className="block mb-2">Afternoon Slots</h2>
                  <Separator />
                  <div></div>
                </div> */}
              </TabsContent>
            ))
          }
        </Tabs>


      </div>
    </DashboardLayout>
  )
}
