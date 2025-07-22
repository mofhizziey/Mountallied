"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: Date | undefined
  ssn: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  ssn?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  general?: string
}

const states = [
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

export function RegistrationFormRobust() {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: undefined,
    ssn: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format"
        isValid = false
      }
      if (!formData.password) {
        newErrors.password = "Password is required"
        isValid = false
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
        isValid = false
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain an uppercase letter"
        isValid = false
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain a lowercase letter"
        isValid = false
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain a number"
        isValid = false
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = "Password must contain a special character"
        isValid = false
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    } else if (step === 2) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required"
        isValid = false
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required"
        isValid = false
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required"
        isValid = false
      } else {
        const today = new Date()
        const birthDate = new Date(formData.dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        if (age < 18) {
          newErrors.dateOfBirth = "You must be at least 18 years old"
          isValid = false
        }
      }
      if (!formData.ssn) {
        newErrors.ssn = "SSN is required"
        isValid = false
      } else if (!/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
        newErrors.ssn = "SSN must be in format 123-45-6789"
        isValid = false
      }
    } else if (step === 3) {
      if (!formData.address1) {
        newErrors.address1 = "Address is required"
        isValid = false
      }
      if (!formData.city) {
        newErrors.city = "City is required"
        isValid = false
      }
      if (!formData.state) {
        newErrors.state = "State is required"
        isValid = false
      }
      if (!formData.zipCode) {
        newErrors.zipCode = "ZIP code is required"
        isValid = false
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = "ZIP code must be in format 12345 or 12345-6789"
        isValid = false
      }
      if (!formData.country) {
        newErrors.country = "Country is required"
        isValid = false
      }
    } else if (step === 4) {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
        isValid = false
      } else if (formData.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits"
        isValid = false
      }
    } else if (step === 5) {
      if (!formData.agreeToTerms) {
        newErrors.general = "You must agree to the terms"
        isValid = false
      }
      if (!formData.agreeToPrivacy) {
        newErrors.general = "You must agree to the privacy policy"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    startTransition(async () => {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (authError) {
          if (authError.message.includes("already registered")) {
            setErrors({ email: "This email is already registered" })
            setCurrentStep(1)
            return
          }
          throw authError
        }

        if (!authData.user) {
          throw new Error("Failed to create user account")
        }

        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : undefined,
          ssn: formData.ssn,
          address_line1: formData.address1,
          address_line2: formData.address2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country,
          license_url: null,
          account_status: "pending",
          is_admin: false,
        })

        if (profileError) {
          throw profileError
        }

        // Redirect to success page
        setSuccessMessage(
          "Your account has been successfully created. Please check your email for further instructions.",
        )
        setTimeout(() => {
          router.push("/register/success")
        }, 3000)
      } catch (error: any) {
        console.error("Registration error:", error)
        setErrors({ general: error.message || "Registration failed. Please try again." })
      }
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Account Information</h3>
              <p className="text-gray-600">Create your secure banking credentials</p>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
                placeholder="Create a strong password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Must be 8+ characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Input
                    id="dateOfBirth"
                    value={formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : ""}
                    onChange={(e) => handleInputChange("dateOfBirth", new Date(e.target.value))}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                    placeholder="Select date"
                    readOnly
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => handleInputChange("dateOfBirth", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <Label htmlFor="ssn">Social Security Number</Label>
              <Input
                id="ssn"
                value={formData.ssn}
                onChange={(e) => handleInputChange("ssn", formatSSN(e.target.value))}
                className={errors.ssn ? "border-red-500" : ""}
                placeholder="123-45-6789"
                maxLength={11}
              />
              {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Your SSN is encrypted and used only for identity verification
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Address Information</h3>
              <p className="text-gray-600">Where can we reach you?</p>
            </div>

            <div>
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => handleInputChange("address1", e.target.value)}
                className={errors.address1 ? "border-red-500" : ""}
                placeholder="123 Main Street"
              />
              {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
            </div>

            <div>
              <Label htmlFor="address2">Address Line 2 (Optional)</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange("address2", e.target.value)}
                placeholder="Apt, Suite, Unit, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  placeholder="New York"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Select onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
                placeholder="12345 or 12345-6789"
                maxLength={10}
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={errors.country ? "border-red-500" : ""}
                placeholder="United States"
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Phone Information</h3>
              <p className="text-gray-600">Provide your phone number for verification</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", formatPhone(e.target.value))}
                className={errors.phone ? "border-red-500" : ""}
                placeholder="(123) 456-7890"
                maxLength={14}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Review & Agreement</h3>
              <p className="text-gray-600">Almost done! Please review and accept our terms</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h4 className="font-medium">Account Setup Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">
                    {formData.address1}, {formData.city}, {formData.state}, {formData.zipCode}, {formData.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Initial Account Setup</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your accounts will be created with $0 balance. Once approved by our team, you can fund your accounts
                    through transfers, deposits, or direct deposit setup.
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Checking Account: $0.00 starting balance</li>
                    <li>• Savings Account: $0.00 starting balance</li>
                    <li>• Credit Account: $1,000 credit limit</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Account Approval Process</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account will be reviewed by our team within 1-2 business days. You'll receive an email
                    notification once your account is approved and ready to use.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600",
                    errors.general ? "border-red-500" : "",
                  )}
                />
                <div className="text-sm">
                  <Label htmlFor="agreeToTerms" className="cursor-pointer">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/conditions" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                      Banking Conditions
                    </a>
                  </Label>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  id="agreeToPrivacy"
                  type="checkbox"
                  checked={formData.agreeToPrivacy}
                  onChange={(e) => handleInputChange("agreeToPrivacy", e.target.checked)}
                  className={cn(
                    "h-4 w-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600",
                    errors.general ? "border-red-500" : "",
                  )}
                />
                <div className="text-sm">
                  <Label htmlFor="agreeToPrivacy" className="cursor-pointer">
                    I acknowledge that I have read and understand the{" "}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Open Your Account</CardTitle>
              <CardDescription>Join WallmountAllied - Step {currentStep} of 5</CardDescription>
            </div>
            <div className="text-sm">
              {successMessage && (
                <Alert variant="success" className="mb-6">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              {errors.general && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
