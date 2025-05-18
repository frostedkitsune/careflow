import DashboardLayout from "@/components/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function PatientProfile() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main Street, Anytown, CA 12345",
    emergencyContact: "Jane Doe - (555) 987-6543",
    medicalHistory: "Allergies: Penicillin\nPrevious Surgeries: Appendectomy (2018)",
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
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
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

                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="space-y-2 sm:w-1/2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2 sm:w-1/2">
                      <Label htmlFor="dateOfBirth">Date of birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" value={profile.address} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={profile.emergencyContact}
                      onChange={handleChange}
                    />
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
                  <AvatarFallback>JD</AvatarFallback>
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

          <TabsContent value="medical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>Update your medical history and important health information</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical history</Label>
                    <Textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={profile.medicalHistory}
                      onChange={handleChange}
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                    Save changes
                  </Button>
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
