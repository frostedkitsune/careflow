import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DashboardLayout from "@/components/dashboard-layout"

export default function ReceptionistProfile() {
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@careflow.com",
    phone: "(555) 234-5678",
    employeeId: "REC-2023-0042",
    department: "Front Desk",
    startDate: "2023-03-15",
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // In a real app, you would save the profile data here
    alert("Profile updated successfully!")
  }

  return (
    <DashboardLayout role="receptionist">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="employment">Employment Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="space-y-2 sm:w-1/2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2 sm:w-1/2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
                  </div>

                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    Save changes
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt="Profile" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline">Upload new picture</Button>
                  <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Remove picture
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>View your employment information</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={profile.employeeId}
                      onChange={handleChange}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={profile.department}
                      onChange={handleChange}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={profile.startDate}
                      onChange={handleChange}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    Update password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
