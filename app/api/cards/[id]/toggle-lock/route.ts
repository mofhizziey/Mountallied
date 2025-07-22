// app/api/cards/[id]/toggle-lock/route.ts
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!["active", "blocked"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cards")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update card" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

