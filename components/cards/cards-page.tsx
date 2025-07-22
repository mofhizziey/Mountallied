"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Plus, Eye, EyeOff, Lock, Unlock, Settings, Trash2, Shield } from "lucide-react"

interface BankCard {
  id: string
  user_id: string
  card_name: string
  card_type: "virtual" | "physical" | "prepaid"
  card_brand: "visa" | "mastercard" | "amex" | "discover"
  card_number_last4: string
  card_token: string | null
  expiry_month: number
  expiry_year: number
  credit_limit: number | null
  available_balance: number | null
  current_balance: number | null
  status: "pending" | "active" | "blocked" | "expired" | "cancelled"
  is_primary: boolean | null
  is_contactless_enabled: boolean | null
  is_international_enabled: boolean | null
  is_online_enabled: boolean | null
  daily_limit: number | null
  monthly_limit: number | null
  atm_limit: number | null
  card_color: string | null
  card_design: string | null
  cardholder_name: string
  billing_address: any | null
  issued_date: string | null
  activation_date: string | null
  last_used_date: string | null
  blocked_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface CardsPageProps {
  cards: BankCard[]
}

export function CardsPage({ cards: initialCards }: CardsPageProps) {
  const [cards, setCards] = useState<BankCard[]>(initialCards)
  const [showCardNumbers, setShowCardNumbers] = useState<{ [key: string]: boolean }>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const toggleCardVisibility = (cardId: string) => {
    setShowCardNumbers((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  const toggleCardLock = async (cardId: string) => {
    setIsLoading(true)
    
    try {
      const card = cards.find((c) => c.id === cardId)
      const newStatus = card?.status === "blocked" ? "active" : "blocked"
      
      const response = await fetch(`/api/cards/${cardId}/toggle-lock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update card status")
      }

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, status: newStatus } : card,
        ),
      )

      setMessage({
        type: "success",
        text: `Card ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update card status. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const deleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete card")
      }

      setCards((prev) => prev.filter((card) => card.id !== cardId))
      setMessage({
        type: "success",
        text: "Card deleted successfully",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete card. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getCardIcon = (type: BankCard["type"]) => {
    return <CreditCard className="w-5 h-5" />
  }

  const getStatusColor = (status: BankCard["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
    }
  }

  const getCardGradient = (type: BankCard["card_type"], color?: string) => {
    if (color) {
      return `bg-gradient-to-br from-[${color}] to-[${color}]/80`
    }
    
    switch (type) {
      case "physical":
        return "bg-gradient-to-br from-blue-600 to-blue-800"
      case "virtual":
        return "bg-gradient-to-br from-green-600 to-green-800"
      case "prepaid":
        return "bg-gradient-to-br from-purple-600 to-purple-800"
      default:
        return "bg-gradient-to-br from-gray-600 to-gray-800"
    }
  }

  const formatExpiryDate = (month: number, year: number) => {
    const monthStr = month.toString().padStart(2, '0')
    const yearStr = year.toString().slice(-2)
    return `${monthStr}/${yearStr}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Cards</CardTitle>
                  <CardDescription>
                    {cards.length > 0 
                      ? `Manage your ${cards.length} card${cards.length === 1 ? '' : 's'}`
                      : "No cards found - add your first card to get started"
                    }
                  </CardDescription>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.length > 0 ? (
            cards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                {/* Card Visual */}
                <div className={`${getCardGradient(card.card_type, card.card_color)} p-6 text-white relative`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm opacity-80">{card.card_name}</p>
                      <p className="text-xs opacity-60 uppercase">{card.card_type} • {card.card_brand}</p>
                      {card.is_primary && (
                        <Badge className="mt-1 bg-yellow-500 text-yellow-900">Primary</Badge>
                      )}
                    </div>
                    <Badge className={getStatusColor(card.status)}>{card.status}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-80">Card Number</p>
                      <p className="text-lg font-mono">
                        {showCardNumbers[card.id] 
                          ? `4532 1234 5678 ${card.card_number_last4}` 
                          : `•••• •••• •••• ${card.card_number_last4}`}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs opacity-80">Expires</p>
                        <p className="font-mono">{formatExpiryDate(card.expiry_month, card.expiry_year)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-80">
                          {card.credit_limit ? "Available" : "Balance"}
                        </p>
                        <p className="font-semibold">
                          $
                          {card.credit_limit 
                            ? (card.available_balance || 0).toFixed(2)
                            : (card.current_balance || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs opacity-80">
                      <p>{card.cardholder_name}</p>
                    </div>
                  </div>

                  {/* Card chip */}
                  <div className="absolute top-16 left-6 w-8 h-6 bg-yellow-400 rounded opacity-80"></div>
                  
                  {/* Contactless symbol */}
                  {card.is_contactless_enabled && (
                    <div className="absolute top-16 right-6">
                      <div className="w-5 h-5 border-2 border-white rounded-full opacity-60"></div>
                    </div>
                  )}
                </div>

                {/* Card Controls */}
                <CardContent className="p-4 space-y-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleCardVisibility(card.id)} 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {showCardNumbers[card.id] ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {showCardNumbers[card.id] ? "Hide" : "Show"}
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleCardLock(card.id)} 
                      className="flex-1"
                      disabled={isLoading || card.status === "pending"}
                    >
                      {card.status === "blocked" ? <Unlock className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                      {card.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-3 text-sm">
                    {card.credit_limit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit Limit:</span>
                        <span className="font-medium">${card.credit_limit.toFixed(2)}</span>
                      </div>
                    )}

                    {card.daily_limit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Limit:</span>
                        <span className="font-medium">${card.daily_limit.toFixed(2)}</span>
                      </div>
                    )}

                    {card.monthly_limit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Limit:</span>
                        <span className="font-medium">${card.monthly_limit.toFixed(2)}</span>
                      </div>
                    )}

                    {card.atm_limit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ATM Limit:</span>
                        <span className="font-medium">${card.atm_limit.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Card Features */}
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${card.is_contactless_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Contactless
                        </div>
                        <div className={`flex items-center gap-1 ${card.is_international_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          International
                        </div>
                        <div className={`flex items-center gap-1 ${card.is_online_enabled ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Online
                        </div>
                        {card.card_type === 'virtual' && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Shield className="w-3 h-3" />
                            Virtual
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={isLoading}>
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteCard(card.id)}
                      disabled={isLoading}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : null}

          {/* Add New Card */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center h-80 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">
                {cards.length === 0 ? "Add Your First Card" : "Add New Card"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {cards.length === 0 
                  ? "Get started by adding a debit, credit, or virtual card"
                  : "Create a virtual card or request a physical card"
                }
              </p>
              <Button>Get Started</Button>
            </CardContent>
          </Card>
        </div>

        {/* Show additional features only if user has cards */}
        {cards.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Real-time Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified of all transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">International Transactions</h4>
                    <p className="text-sm text-gray-600">Allow purchases abroad</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Online Purchases</h4>
                    <p className="text-sm text-gray-600">Enable e-commerce transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Transaction history will appear here</p>
                    <p className="text-xs mt-1">Connect your cards to see recent activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state message for no cards */}
        {cards.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Cards Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't added any cards yet. Add your first card to start managing your finances with our secure banking platform.
              </p>
              <Button size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        {message && (
          <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}