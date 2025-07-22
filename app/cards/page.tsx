import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { CardsPage } from "@/components/cards/cards-page"

export default async function CardsPageRoute() {
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

  // Fetch user's cards from database
  const { data: userCards, error: cardsError } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (cardsError) {
    console.error("Error fetching cards:", cardsError)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar profile={profile} />
      <div className="flex-1 overflow-auto">
        <CardsPage cards={userCards || []} />
      </div>
    </div>
  )
}