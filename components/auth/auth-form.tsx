"use client"

import type React from "react"

import { useState } from "react" // Added useEffect for pre-filling data
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [registrationStep, setRegistrationStep] = useState(1) // 1: Basic Info, 2: Address, 3: PIN
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [pin, setPin] = useState("") // For PIN entry during sign-in
  const [newPin, setNewPin] = useState("") // For creating new PIN during registration
  const [confirmPin, setConfirmPin] = useState("")

  // Form fields for multi-step registration
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "", // Stored as 'YYYY-MM-DD' string
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const supabase = createClient()
  const router = useRouter()

  // Standardized hash function for PIN security
  const hashPin = (pin: string): string => {
    // In production, use a proper hashing library like bcrypt
    return btoa(pin + "salt_key_here") // Standardized salt for consistency
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const validatePin = (pin: string): boolean => {
    return /^\d{4}$/.test(pin)
  }

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Validation for registration steps
  const validateStep1 = (): boolean => {
    const isPhoneValid = formData.phone.replace(/\D/g, "").length === 10
    const isDateValid =
      formData.dateOfBirth !== "" &&
      new Date(formData.dateOfBirth) <=
        new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())
    return !!(formData.firstName.trim() && formData.lastName.trim() && isPhoneValid && isDateValid)
  }

  const validateStep2 = (): boolean => {
    return !!(formData.addressLine1.trim() && formData.city.trim() && formData.state.trim() && formData.zipCode.trim())
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (!validatePin(newPin)) {
        throw new Error("PIN must be exactly 4 digits")
      }
      if (newPin !== confirmPin) {
        throw new Error("PINs do not match")
      }
      if (!userId) {
        throw new Error("User session not found")
      }

      const hashedPin = hashPin(newPin)

      // Update the existing user profile with collected data
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          phone: formData.phone.replace(/\D/g, ""), // Store only digits
          date_of_birth: formData.dateOfBirth, // Already in 'YYYY-MM-DD' format
          address_line1: formData.addressLine1.trim(),
          address_line2: formData.addressLine2.trim() || null,
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip_code: formData.zipCode.trim(),
          country: formData.country,
          pin_hash: hashedPin,
          account_status: "pending", // Set to pending, admin will activate
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId) // Crucially, update the existing row created by the trigger

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw new Error("Failed to complete profile. Please try again.")
      }

      setMessage({
        type: "success",
        text: "Registration completed successfully! Your account is under review. Please sign in.",
      })
      // Reset states and redirect to sign in after a delay
      setTimeout(() => {
        setShowPinSetup(false)
        setRegistrationStep(1)
        setUserId(null)
        setUserEmail(null)
        setNewPin("")
        setConfirmPin("")
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          dateOfBirth: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zipCode: "",
          country: "United States",
        })
        router.push("/auth") // Redirect to sign-in page
      }, 2000)
    } catch (error: any) {
      console.error("Registration completion error:", error)
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handlePinVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (!validatePin(pin)) {
        throw new Error("Please enter a 4-digit PIN")
      }
      if (!userId) {
        throw new Error("User session not found. Please sign in again.")
      }

      // Get the user's hashed PIN from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("pin_hash, first_name, account_status")
        .eq("id", userId)
        .single()

      if (profileError) {
        console.error("Supabase profile fetch error:", profileError)
        throw new Error("Failed to verify PIN. Please try again.")
      }
      if (!profile || !profile.pin_hash) {
        throw new Error("No PIN found for this account. Please contact support.")
      }

      // Hash the entered PIN and compare with the stored hash
      const enteredPinHash = hashPin(pin)
      if (enteredPinHash !== profile.pin_hash) {
        throw new Error("Incorrect PIN. Please try again.")
      }

      setMessage({ type: "success", text: "PIN verified successfully! Redirecting to dashboard..." })

      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: any) {
      console.error("PIN verification error:", error)
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        throw new Error("Email and password are required")
      }
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        // Check if user has completed registration (i.e., has a profile with a PIN)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, pin_hash, first_name, last_name, account_status, phone, date_of_birth, address_line1, address_line2, city, state, zip_code, country",
          )
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // No profile found - user needs to complete registration
          setUserId(data.user.id)
          setUserEmail(data.user.email)
          setShowPinSetup(true)
          setMessage({
            type: "success",
            text: "Please complete your registration.",
          })
        } else if (profileError) {
          console.error("Profile fetch error:", profileError)
          throw new Error("Failed to retrieve user profile. Please try again.")
        } else if (profile && profile.pin_hash) {
          // User has completed registration, show PIN entry
          setUserId(data.user.id)
          setShowPinEntry(true)
          setMessage({
            type: "success",
            text: `Welcome back, ${profile.first_name || profile.email}! Please enter your PIN.`,
          })
        } else {
          // Profile exists but no PIN_hash (e.g., old registration or incomplete)
          setUserId(data.user.id)
          setUserEmail(data.user.email)
          // Pre-fill existing data if available
          setFormData({
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            phone: profile?.phone || "",
            dateOfBirth: profile?.date_of_birth || "",
            addressLine1: profile?.address_line1 || "",
            addressLine2: profile?.address_line2 || "",
            city: profile?.city || "",
            state: profile?.state || "",
            zipCode: profile?.zip_code || "",
            country: profile?.country || "United States",
          })
          setShowPinSetup(true)
          setMessage({
            type: "success",
            text: "Please complete your registration.",
          })
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error)
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (formData: FormData) => {
    setLoading(true)
    setMessage(null)
    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required")
      }
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address")
      }
      if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters long")
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // Email is already confirmed, proceed to registration
          setUserId(data.user.id)
          setUserEmail(data.user.email)
          setShowPinSetup(true)
          setMessage({
            type: "success",
            text: "Account created successfully! Please complete your profile.",
          })
        } else {
          // Email confirmation required
          setMessage({
            type: "success",
            text: "Please check your email to confirm your account, then sign in to complete registration!",
          })
        }
      }
    } catch (error: any) {
      console.error("Sign up error:", error)
      setMessage({ type: "error", text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    setShowPinEntry(false)
    setShowPinSetup(false)
    setRegistrationStep(1)
    setUserId(null)
    setUserEmail(null)
    setPin("")
    setNewPin("")
    setConfirmPin("")
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    })
    setMessage(null)
  }

  // PIN Entry Form (after successful sign-in)
  if (showPinEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">WAB</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Enter Your PIN</CardTitle>
            <CardDescription>Please enter your 4-digit PIN to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || pin.length !== 4}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying PIN...
                  </>
                ) : (
                  "Verify PIN"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleBackToSignIn}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </form>
            {message && (
              <Alert
                className={`mt-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
              >
                <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Multi-step Registration Form (after initial sign-up or incomplete sign-in)
  if (showPinSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">WAB</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Registration</CardTitle>
            <CardDescription>
              Step {registrationStep} of 3:{" "}
              {registrationStep === 1
                ? "Personal Information"
                : registrationStep === 2
                  ? "Address Information"
                  : "Security Setup"}
            </CardDescription>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${step <= registrationStep ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {registrationStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formatPhoneNumber(formData.phone)}
                    onChange={(e) => updateFormData("phone", e.target.value.replace(/\D/g, ""))}
                    maxLength={14} // (XXX) XXX-XXXX
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                    max={
                      new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())
                        .toISOString()
                        .split("T")[0]
                    } // Max date is 18 years ago
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBackToSignIn} className="bg-transparent">
                    Back to Sign In
                  </Button>
                  <Button type="button" onClick={() => setRegistrationStep(2)} disabled={!validateStep1()}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
            {registrationStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    type="text"
                    placeholder="Street address"
                    value={formData.addressLine1}
                    onChange={(e) => updateFormData("addressLine1", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    type="text"
                    placeholder="Apartment, suite, etc."
                    value={formData.addressLine2}
                    onChange={(e) => updateFormData("addressLine2", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => updateFormData("state", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) => updateFormData("country", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegistrationStep(1)}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button type="button" onClick={() => setRegistrationStep(3)} disabled={!validateStep2()}>
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
            {registrationStep === 3 && (
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPin">Create 4-digit PIN *</Label>
                  <Input
                    id="newPin"
                    type="password"
                    placeholder="Enter 4-digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPin">Confirm PIN *</Label>
                  <Input
                    id="confirmPin"
                    type="password"
                    placeholder="Confirm 4-digit PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegistrationStep(2)}
                    disabled={loading}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" disabled={loading || newPin.length !== 4 || confirmPin.length !== 4}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>
            )}
            {message && (
              <Alert
                className={`mt-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
              >
                <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Auth Form (Sign In / Sign Up)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">WAB</span>
            </div>
          </div>
          <CardTitle className="text-2xl">WallmountAlliedBank</CardTitle>
          <CardDescription>Secure banking for your future</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form action={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form action={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {message && (
            <Alert
              className={`mt-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
