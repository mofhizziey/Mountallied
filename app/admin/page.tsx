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

  // TEMPORARILY COMMENTED OUT FOR TESTING
  if (!profile || !profile.is_admin) {
    redirect("/dashboard")
  }

  // Show warning if not admin but allow access for testing
  const isAdmin = profile?.is_admin || false

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 overflow-auto">
        {!isAdmin && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            <strong>Warning:</strong> You are not an admin user. This page is shown for testing purposes only.
          </div>
        )}
        <AdminPanel />
      </div>
    </div>
  )
}