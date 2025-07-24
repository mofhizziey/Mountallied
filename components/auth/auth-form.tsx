"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation" // Import useRouter

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showPinEntry, setShowPinEntry] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [pin, setPin] = useState("")
  const supabase = createClient()
  const router = useRouter() // Initialize useRouter

  // Simple hash function for PIN (in production, use bcrypt or similar)
  // This MUST match the hashing logic used during registration
  const hashPin = (pin: string): string => {
    return btoa(pin + "salt_key_here") // Example: using btoa for demo
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const handlePinVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      if (!pin || pin.length !== 4) {
        throw new Error("Please enter a 4-digit PIN")
      }
      if (!userId) {
        throw new Error("User session not found. Please sign in again.")
      }

      // Get the user's HASHED PIN from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("pin_hash") // Select pin_hash instead of plain pin
        .eq("id", userId)
        .single()

      if (profileError) {
        console.error("Supabase profile fetch error:", profileError)
        throw new Error("Failed to verify PIN. Please try again.")
      }
      if (!profile || !profile.pin_hash) {
        // This case should ideally not happen if registration is complete
        throw new Error("No PIN found for this account. Please complete registration.")
      }

      // Hash the entered PIN and compare with the stored hash
      const enteredPinHash = hashPin(pin)
      if (enteredPinHash !== profile.pin_hash) {
        throw new Error("Incorrect PIN")
      }

      setMessage({ type: "success", text: "PIN verified successfully! Redirecting..." })
      setTimeout(() => {
        router.push("/dashboard") // Use router.push for client-side navigation
      }, 1000)
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

      // Validation
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
        const { data: profile, error: profileFetchError } = await supabase
          .from("profiles")
          .select("id, pin_hash") // Select pin_hash to check if profile is complete
          .eq("id", data.user.id)
          .single()

        if (profileFetchError && profileFetchError.code === "PGRST116") {
          // No row found
          // User signed in, but no profile exists (meaning registration is incomplete)
          setMessage({ type: "success", text: "Signed in successfully! Redirecting to complete registration..." })
          setTimeout(() => {
            router.push("/register") // Use router.push
          }, 1000)
        } else if (profileFetchError) {
          // Other profile fetch error
          console.error("Profile fetch error during sign-in:", profileFetchError)
          throw new Error("Failed to retrieve user profile. Please try again.")
        } else if (profile && profile.pin_hash) {
          // User exists and has a PIN, show PIN entry
          setUserId(data.user.id)
          setShowPinEntry(true)
          setMessage({ type: "success", text: "Sign in successful! Please enter your PIN to continue." })
        } else {
          // User exists but no PIN_hash (e.g., old registration or incomplete)
          setMessage({ type: "success", text: "Signed in successfully! Redirecting to complete registration..." })
          setTimeout(() => {
            router.push("/register") // Use router.push
          }, 1000)
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

      // Validation
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
          setMessage({
            type: "success",
            text: "Account created successfully! Redirecting to complete registration...",
          })
          setTimeout(() => {
            router.push("/register") // Use router.push
          }, 2000)
        } else {
          setMessage({
            type: "success",
            text: "Please check your email to confirm your account before signing in!",
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
    setUserId(null)
    setPin("")
    setMessage(null)
  }

  if (showPinEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PPB</span>
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PPB</span>
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
