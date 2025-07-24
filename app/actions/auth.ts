"use server"

import { createClient } from "@/utils/supabase/server"
import { format } from "date-fns"

// Simple hash function for PIN (in production, use bcrypt or similar)
const hashPin = (pin: string): string => {
  // Using btoa for demo purposes - in production, use proper hashing like bcrypt
  return btoa(pin + "salt_key_here")
}

export async function signUpAndCreateProfile(formData: {
  email: string
  password: string
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
  pin: string
}) {
  const supabase = createClient()

  const {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    ssn,
    phone,
    address1,
    address2,
    city,
    state,
    zipCode,
    country,
    pin,
  } = formData

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { success: false, error: "This email is already registered" }
    }
    console.error("Auth signup error:", authError)
    return { success: false, error: authError.message || "Failed to create user account." }
  }

  if (!authData.user) {
    return { success: false, error: "Failed to create user account: No user data returned." }
  }

  // 2. Create profile entry
  const hashedPin = hashPin(pin)

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id, // Use the ID from the newly created auth user
    email: authData.user.email, // Use the email from the newly created auth user
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
    ssn: ssn,
    address_line1: address1,
    address_line2: address2,
    city: city,
    state: state,
    zip_code: zipCode,
    pin: pin, // Consider removing this in production and only storing pin_hash
    pin_hash: hashedPin,
    account_status: "pending", // Default status
    is_admin: false, // Default status
  })

  if (profileError) {
    console.error("Profile creation error:", profileError)
    if (profileError.message.includes("row-level security")) {
      return { success: false, error: "Database security configuration error. Please contact support." }
    }
    return { success: false, error: profileError.message || "Failed to create user profile." }
  }

  return {
    success: true,
    message: "Your account has been successfully created. Please check your email for further instructions.",
  }
}
