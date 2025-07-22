// app/api/cards/route.ts
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cardData = await request.json()
    
    // Validate required fields
    const requiredFields = ['card_type', 'card_name', 'card_number_last4', 'expiry_month', 'expiry_year', 'cardholder_name']
    const missingFields = requiredFields.filter(field => !cardData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` }, 
        { status: 400 }
      )
    }

    // Validate card type
    if (!['virtual', 'physical', 'prepaid'].includes(cardData.card_type)) {
      return NextResponse.json({ error: "Invalid card type" }, { status: 400 })
    }

    // Validate last4
    if (!/^\d{4}$/.test(cardData.card_number_last4)) {
      return NextResponse.json({ error: "card_number_last4 must be 4 digits" }, { status: 400 })
    }

    // Validate expiry
    if (!Number.isInteger(cardData.expiry_month) || cardData.expiry_month < 1 || cardData.expiry_month > 12) {
      return NextResponse.json({ error: "expiry_month must be between 1 and 12" }, { status: 400 })
    }

    const currentYear = new Date().getFullYear()
    if (!Number.isInteger(cardData.expiry_year) || cardData.expiry_year < currentYear) {
      return NextResponse.json({ error: "expiry_year must be current year or later" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cards")
      .insert({
        user_id: user.id,
        card_type: cardData.card_type,
        card_brand: cardData.card_brand || 'visa',
        card_name: cardData.card_name,
        card_number_last4: cardData.card_number_last4,
        expiry_month: cardData.expiry_month,
        expiry_year: cardData.expiry_year,
        cardholder_name: cardData.cardholder_name,
        current_balance: cardData.current_balance || 0,
        available_balance: cardData.available_balance || 0,
        credit_limit: cardData.credit_limit,
        daily_limit: cardData.daily_limit || 1000,
        monthly_limit: cardData.monthly_limit || 10000,
        atm_limit: cardData.atm_limit || 500,
        card_color: cardData.card_color || '#1e40af',
        card_design: cardData.card_design || 'default',
        is_primary: cardData.is_primary || false,
        is_contactless_enabled: cardData.is_contactless_enabled !== false,
        is_international_enabled: cardData.is_international_enabled || false,
        is_online_enabled: cardData.is_online_enabled !== false,
        status: 'pending',
        billing_address: cardData.billing_address
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create card" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}