"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Calendar, Shield, AlertCircle, CheckCircle } from "lucide-react"
import type { Profile } from "@/lib/types"

interface ProfilePageProps {
  profile: Profile | null
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export function ProfilePage({ profile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address_line1: profile?.address_line1 || "",
    address_line2: profile?.address_line2 || "",
    city: profile?.city || "",
    state: profile?.state || "",
    zip_code: profile?.zip_code || "",
  })

  const supabase = createClient()

  if (!profile) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Unable to load profile information. Please try refreshing the page.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setIsEditing(false)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      address_line1: profile.address_line1 || "",
      address_line2: profile.address_line2 || "",
      city: profile.city || "",
      state: profile.state || "",
      zip_code: profile.zip_code || "",
    })
    setIsEditing(false)
    setMessage(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "locked":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(profile.account_status)}>{profile.account_status}</Badge>
            {profile.is_admin && <Badge variant="outline">Admin</Badge>}
          </div>
        </div>

        {/* Message */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {profile.first_name?.[0] || "U"}
                  {profile.last_name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {profile.first_name || "User"} {profile.last_name || ""}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">{profile.first_name || "Not provided"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">{profile.last_name || "Not provided"}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                  placeholder="(123) 456-7890"
                  maxLength={14}
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone || "Not provided"}</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <p className="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not provided"}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Contact support to update your date of birth</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Address Information</span>
            </CardTitle>
            <CardDescription>Your current address on file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address1">Address Line 1</Label>
              {isEditing ? (
                <Input
                  id="address1"
                  value={formData.address_line1}
                  onChange={(e) => handleInputChange("address_line1", e.target.value)}
                  placeholder="123 Main Street"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.address_line1 || "Not provided"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              {isEditing ? (
                <Input
                  id="address2"
                  value={formData.address_line2}
                  onChange={(e) => handleInputChange("address_line2", e.target.value)}
                  placeholder="Apt, Suite, Unit, etc."
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.address_line2 || "Not provided"}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">{profile.city || "Not provided"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <Select onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={formData.state || "Select state"} />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-900 mt-1">{profile.state || "Not provided"}</p>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                {isEditing ? (
                  <Input
                    id="zipCode"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange("zip_code", e.target.value)}
                    placeholder="12345"
                    maxLength={10}
                  />
                ) : (
                  <p className="text-sm text-gray-900 mt-1">{profile.zip_code || "Not provided"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Information</span>
            </CardTitle>
            <CardDescription>Sensitive information (view only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Social Security Number</Label>
              <p className="text-sm text-gray-900 mt-1">
                {profile.ssn ? `***-**-${profile.ssn.slice(-4)}` : "Not provided"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Contact support to update your SSN</p>
            </div>

            <div>
              <Label>Account Created</Label>
              <p className="text-sm text-gray-900 mt-1">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>

            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-gray-900 mt-1">{new Date(profile.updated_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        {profile.account_status === "pending" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Account Pending Approval</CardTitle>
              <CardDescription className="text-yellow-700">
                Your account is currently under review. You'll receive an email notification once approved.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
