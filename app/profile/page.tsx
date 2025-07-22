import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ProfilePage } from "@/components/profile/profile-page"

export default async function Profile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Get user profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 overflow-auto">
        <ProfilePage profile={profile} />
      </div>
    </div>
  )
}
