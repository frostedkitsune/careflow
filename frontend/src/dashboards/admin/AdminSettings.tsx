import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Database, Cloud } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { toast } from "sonner"

export default function AdminSettings() {
  // General settings
  const [systemName, setSystemName] = useState("CareFlow Healthcare Management System")
  const [supportEmail, setSupportEmail] = useState("support@careflow.health")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [passwordExpiry, setPasswordExpiry] = useState("90")
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Backup settings
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [retentionPeriod, setRetentionPeriod] = useState("30")

  const handleSaveSettings = (section: string) => {
    // In a real app, you would save the settings to the server here
    toast("Settings saved", {
      description: `${section} settings have been successfully saved.`,
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup & Storage</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input id="systemName" value={systemName} onChange={(e) => setSystemName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between space-y-0 pt-2">
                  <div className="flex flex-col">
                    <Label htmlFor="maintenanceMode" className="mb-1">
                      Maintenance Mode
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      When enabled, only administrators can access the system
                    </span>
                  </div>
                  <Switch id="maintenanceMode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => handleSaveSettings("General")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-y-0">
                  <div className="flex flex-col">
                    <Label htmlFor="emailNotifications" className="mb-1">
                      Email Notifications
                    </Label>
                    <span className="text-sm text-muted-foreground">Send notifications via email</span>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between space-y-0 pt-2">
                  <div className="flex flex-col">
                    <Label htmlFor="smsNotifications" className="mb-1">
                      SMS Notifications
                    </Label>
                    <span className="text-sm text-muted-foreground">Send notifications via SMS</span>
                  </div>
                  <Switch id="smsNotifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between space-y-0 pt-2">
                  <div className="flex flex-col">
                    <Label htmlFor="appointmentReminders" className="mb-1">
                      Appointment Reminders
                    </Label>
                    <span className="text-sm text-muted-foreground">Send reminders for upcoming appointments</span>
                  </div>
                  <Switch
                    id="appointmentReminders"
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>

                <div className="flex items-center justify-between space-y-0 pt-2">
                  <div className="flex flex-col">
                    <Label htmlFor="systemAlerts" className="mb-1">
                      System Alerts
                    </Label>
                    <span className="text-sm text-muted-foreground">Send alerts for system events</span>
                  </div>
                  <Switch id="systemAlerts" checked={systemAlerts} onCheckedChange={setSystemAlerts} />
                </div>

                <Button
                  className="bg-teal-600 hover:bg-teal-700 mt-4"
                  onClick={() => handleSaveSettings("Notification")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure system security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-y-0">
                  <div className="flex flex-col">
                    <Label htmlFor="twoFactorAuth" className="mb-1">
                      Two-Factor Authentication
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      Require two-factor authentication for all users
                    </span>
                  </div>
                  <Switch id="twoFactorAuth" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Number of days before passwords expire (0 for never)</p>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Minutes of inactivity before automatic logout</p>
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => handleSaveSettings("Security")}>
                  <Shield className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Storage Settings</CardTitle>
                <CardDescription>Configure system backup and storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-y-0">
                  <div className="flex flex-col">
                    <Label htmlFor="autoBackup" className="mb-1">
                      Automatic Backups
                    </Label>
                    <span className="text-sm text-muted-foreground">Enable automatic database backups</span>
                  </div>
                  <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    value={retentionPeriod}
                    onChange={(e) => setRetentionPeriod(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">Number of days to keep backups</p>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Storage Usage</h4>
                      <p className="text-sm text-muted-foreground">42% of 500GB used</p>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline">
                      <Database className="mr-2 h-4 w-4" />
                      Manual Backup
                    </Button>
                    <Button variant="outline">
                      <Cloud className="mr-2 h-4 w-4" />
                      Configure Storage
                    </Button>
                  </div>
                </div>

                <Button className="bg-teal-600 hover:bg-teal-700 mt-4" onClick={() => handleSaveSettings("Backup")}>
                  <Database className="mr-2 h-4 w-4" />
                  Save Backup Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
