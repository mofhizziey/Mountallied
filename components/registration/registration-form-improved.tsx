"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"

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

export function RegistrationFormImproved() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const supabase = createClient()

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    setUploadStatus("idle")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage({ type: "error", text: "Please sign in first" })
        setLoading(false)
        return
      }

      let licenseUrl = null

      // Upload license file if provided
      if (licenseFile) {
        setUploadStatus("uploading")
        try {
          // Check if bucket exists, create if it doesn't
          const { data: buckets } = await supabase.storage.listBuckets()
          const documentsBucket = buckets?.find((bucket) => bucket.name === "documents")

          if (!documentsBucket) {
            console.log("Creating documents bucket...")
            const { error: bucketError } = await supabase.storage.createBucket("documents", {
              public: true,
              allowedMimeTypes: ["image/*", "application/pdf"],
              fileSizeLimit: 10485760, // 10MB
            })

            if (bucketError && !bucketError.message.includes("already exists")) {
              throw new Error(`Failed to create storage bucket: ${bucketError.message}`)
            }
          }

          const fileExt = licenseFile.name.split(".").pop()
          const fileName = `${user.id}/license-${Date.now()}.${fileExt}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("documents")
            .upload(fileName, licenseFile, { upsert: true })

          if (uploadError) {
            throw new Error(`File upload failed: ${uploadError.message}`)
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("documents").getPublicUrl(fileName)

          licenseUrl = publicUrl
          setUploadStatus("success")
        } catch (fileError: any) {
          console.error("File upload error:", fileError)
          setUploadStatus("error")
          setMessage({
            type: "warning",
            text: `Document upload failed: ${fileError.message}. Registration will continue without the document.`,
          })
        }
      }

      // Create or update profile
      const profileData = {
        id: user.id,
        email: user.email!,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        date_of_birth: formData.get("dateOfBirth") as string,
        ssn: formData.get("ssn") as string,
        address_line1: formData.get("addressLine1") as string,
        address_line2: formData.get("addressLine2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip_code: formData.get("zipCode") as string,
        license_url: licenseUrl,
        account_status: "pending",
      }

      const { error } = await supabase.from("profiles").upsert(profileData)

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: "Registration completed successfully! Your account is pending approval.",
      })

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
      setUploadStatus("error")
    }

    setLoading(false)
  }

  const getUploadStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Upload className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PPB</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Your Registration</CardTitle>
            <CardDescription>Please provide the required information to open your bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number *</Label>
                  <Input id="ssn" name="ssn" placeholder="XXX-XX-XXXX" maxLength={11} required />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input id="addressLine1" name="addressLine1" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input id="addressLine2" name="addressLine2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select name="state" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input id="zipCode" name="zipCode" required />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Upload (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="license">Driver's License or State ID</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center mb-4">{getUploadStatusIcon()}</div>
                    <div className="mt-4">
                      <Input
                        id="license"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          setLicenseFile(e.target.files?.[0] || null)
                          setUploadStatus("idle")
                        }}
                        className="hidden"
                        disabled={loading}
                      />
                      <Label
                        htmlFor="license"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Choose File
                      </Label>
                      {licenseFile && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Selected: {licenseFile.name}</p>
                          {uploadStatus === "success" && <p className="text-sm text-green-600">✓ Upload successful</p>}
                          {uploadStatus === "error" && <p className="text-sm text-red-600">✗ Upload failed</p>}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, PDF (Max 10MB)</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Complete Registration"}
              </Button>
            </form>

            {message && (
              <Alert
                className={`mt-4 ${
                  message.type === "error"
                    ? "border-red-200 bg-red-50"
                    : message.type === "warning"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-green-200 bg-green-50"
                }`}
              >
                <AlertDescription
                  className={
                    message.type === "error"
                      ? "text-red-800"
                      : message.type === "warning"
                        ? "text-yellow-800"
                        : "text-green-800"
                  }
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
