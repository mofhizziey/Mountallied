import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DeviceManagement } from "@/components/security/device-management"

export default async function DeviceManagementPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/register")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 overflow-auto">
        <DeviceManagement />
      </div>
    </div>
  )
}