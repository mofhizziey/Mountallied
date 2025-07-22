import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { RegistrationFormRobust } from "@/components/registration/registration-form-robust"

export default async function RegisterPage() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/auth")
    }

    // Check if user already has a profile
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (profile) {
      redirect("/dashboard")
    }

    return <RegistrationFormRobust />
  } catch (error) {
    console.error("Register page error:", error)
    redirect("/auth")
  }
}
