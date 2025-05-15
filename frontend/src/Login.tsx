import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router"
import { users } from "@/lib/data"
import { useCareFlowStore } from "@/lib/store"
import type { User } from "@/lib/store"

export default function LoginPage() {
  const [role, setRole] = useState("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const setCurrentUser = useCareFlowStore((state: { setCurrentUser: any }) => state.setCurrentUser)
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login process
    setTimeout(() => {
      // Find user by email and role
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase() && u.role === role)

      if (user && password) {
        // Set current user in store
        setCurrentUser({ id: user.id, role: user.role })

        // Redirect to dashboard based on role
        navigate(`/${role}/dashboard`)
        toast("Login successful",{
          description: `Welcome back, ${user.name}!`,
        })
      } else {
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again."
        })
        setLoading(false)
      }
    }, 1000)
  }

  // Demo credentials for each role
  const getDemoCredentials = () => {
    switch (role) {
      case "patient":
        return { email: "suhani.roy@personal.email", password: "password" }
      case "receptionist":
        return { email: "sarah.johnson@careflow.health", password: "password" }
      case "doctor":
        return { email: "dr.chen@careflow.health", password: "password" }
      case "admin":
        return { email: "admin@careflow.health", password: "password" }
      default:
        return { email: "", password: "" }
    }
  }

  const fillDemoCredentials = () => {
    const {email, password} = getDemoCredentials()
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-teal-600">CareFlow</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@example.email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4">
            <Button variant="outline" className="w-full text-teal-600" onClick={fillDemoCredentials} type="button">
              Use Demo Credentials
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-center text-gray-500 mt-2">
            <Link to="#" className="text-teal-600 hover:text-teal-700">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
