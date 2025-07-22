"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
} from "lucide-react"

interface Transaction {
  id: string
  type: "sent" | "received"
  amount: number
  recipient: string
  date: string
  status: "completed" | "pending" | "failed"
  description?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "sent",
    amount: 250.0,
    recipient: "John Smith",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    description: "Dinner split",
  },
  {
    id: "2",
    type: "received",
    amount: 1200.0,
    recipient: "Sarah Johnson",
    date: "2024-01-14T15:45:00Z",
    status: "completed",
    description: "Rent payment",
  },
  {
    id: "3",
    type: "sent",
    amount: 75.5,
    recipient: "Mike Wilson",
    date: "2024-01-13T09:15:00Z",
    status: "pending",
    description: "Grocery reimbursement",
  },
]

const recentRecipients = [
  { name: "John Smith", email: "john@example.com", avatar: "JS" },
  { name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ" },
  { name: "Mike Wilson", email: "mike@example.com", avatar: "MW" },
  { name: "Emma Davis", email: "emma@example.com", avatar: "ED" },
]

export function TransfersPage() {
  const [activeTab, setActiveTab] = useState("send")
  const [sendAmount, setSendAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [description, setDescription] = useState("")
  const [requestAmount, setRequestAmount] = useState("")
  const [requestFrom, setRequestFrom] = useState("")
  const [requestDescription, setRequestDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sendAmount || !recipient) return

    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({
        type: "success",
        text: `Successfully sent $${sendAmount} to ${recipient}`,
      })

      // Reset form
      setSendAmount("")
      setRecipient("")
      setDescription("")
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send money. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestAmount || !requestFrom) return

    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({
        type: "success",
        text: `Successfully requested $${requestAmount} from ${requestFrom}`,
      })

      // Reset form
      setRequestAmount("")
      setRequestFrom("")
      setRequestDescription("")
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send request. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Transfers</CardTitle>
                <CardDescription>Send money to friends and family or request payments</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month Received</p>
                  <p className="text-xl font-semibold">$2,450.00</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month Sent</p>
                  <p className="text-xl font-semibold">$1,325.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-semibold">$75.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Send Money</TabsTrigger>
            <TabsTrigger value="request">Request Money</TabsTrigger>
          </TabsList>

          {/* Send Money Tab */}
          <TabsContent value="send">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Money
                  </CardTitle>
                  <CardDescription>Transfer money to anyone instantly</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMoney} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient</Label>
                      <Input
                        id="recipient"
                        placeholder="Enter name, email, or phone"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="What's this for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Money
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentRecipients.map((person, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setRecipient(person.name)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {person.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-sm text-gray-600">{person.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Request Money Tab */}
          <TabsContent value="request">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Request Money
                </CardTitle>
                <CardDescription>Ask someone to send you money</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestMoney} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="requestFrom">Request From</Label>
                    <Input
                      id="requestFrom"
                      placeholder="Enter name, email, or phone"
                      value={requestFrom}
                      onChange={(e) => setRequestFrom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestAmount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="requestAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestDescription">Description (Optional)</Label>
                    <Input
                      id="requestDescription"
                      placeholder="What's this for?"
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Send Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest money transfers and requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "sent" ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.type === "sent" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {transaction.type === "sent" ? "Sent to" : "Received from"} {transaction.recipient}
                        </p>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDate(transaction.date)}</span>
                        {transaction.description && <span>• {transaction.description}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === "sent" ? "text-red-600" : "text-green-600"}`}>
                      {transaction.type === "sent" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
