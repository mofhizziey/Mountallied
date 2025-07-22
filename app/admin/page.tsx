import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AdminPanel } from "@/components/admin/admin-panel"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Get user profile and check if admin
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !profile.is_admin) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen bg-gray-50">
    <DashboardSidebar profile={profile} />
    <div className="flex-1 overflow-auto">
      <AdminPanel />
    </div>
  </div>
  )
}
