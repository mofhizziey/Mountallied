"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Inbox,
} from "lucide-react"

interface Transaction {
  id: string
  account_id: string
  transaction_type: "debit" | "credit" | "transfer"
  amount: number
  description: string | null
  reference_number: string | null
  status: "completed" | "pending" | "failed"
  created_at: string
}

interface TransferDisplay extends Transaction {
  type: "sent" | "received"
  recipient: string
}

// Mock user account ID - in real app this would come from authentication
const CURRENT_USER_ACCOUNT_ID = "user-123"

const recentRecipients = [
  { name: "John Smith", email: "john@example.com", avatar: "JS" },
  { name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ" },
  { name: "Mike Wilson", email: "mike@example.com", avatar: "MW" },
  { name: "Emma Davis", email: "emma@example.com", avatar: "ED" },
]

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState("send")
  const [sendAmount, setSendAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [description, setDescription] = useState("")
  const [requestAmount, setRequestAmount] = useState("")
  const [requestFrom, setRequestFrom] = useState("")
  const [requestDescription, setRequestDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [transfers, setTransfers] = useState<TransferDisplay[]>([])
  const [stats, setStats] = useState({
    monthlyReceived: 0,
    monthlySent: 0,
    pending: 0
  })

  // Mock function to simulate database query for transfers
  const fetchTransfers = async () => {
    setLoadingTransactions(true)
    try {
      // Simulate API call to fetch transfers
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response - in real app this would be a database query
      // SELECT * FROM transactions WHERE account_id = ? AND transaction_type = 'transfer' ORDER BY created_at DESC
      const mockDbTransfers: Transaction[] = [
        // Empty array to simulate no transfers in database
        // Add mock data here if you want to test with sample data
      ]

      // Transform database transactions to display format
      const transfersDisplay: TransferDisplay[] = mockDbTransfers.map(transaction => {
        // Determine if this is sent or received based on amount sign and transaction details
        // This logic would depend on your specific business rules
        const isSent = transaction.amount < 0 || transaction.transaction_type === 'debit'
        
        return {
          ...transaction,
          type: isSent ? "sent" : "received",
          recipient: transaction.description?.split(' - ')[1] || "Unknown", // Extract recipient from description
          amount: Math.abs(transaction.amount) // Always show positive amount
        }
      })

      setTransfers(transfersDisplay)

      // Calculate stats from transfers
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const monthlyTransfers = transfersDisplay.filter(t => {
        const transferDate = new Date(t.created_at)
        return transferDate.getMonth() === currentMonth && transferDate.getFullYear() === currentYear
      })

      const monthlyReceived = monthlyTransfers
        .filter(t => t.type === "received" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0)

      const monthlySent = monthlyTransfers
        .filter(t => t.type === "sent" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0)

      const pending = transfersDisplay
        .filter(t => t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0)

      setStats({
        monthlyReceived,
        monthlySent,
        pending
      })

    } catch (error) {
      console.error('Failed to fetch transfers:', error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  const handleSendMoney = async () => {
    if (!sendAmount || !recipient) return

    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call to insert into database
      // INSERT INTO transactions (account_id, transaction_type, amount, description, reference_number, status)
      // VALUES (?, 'transfer', ?, ?, ?, 'pending')
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({
        type: "success",
        text: `Successfully sent $${sendAmount} to ${recipient}`,
      })

      // Reset form
      setSendAmount("")
      setRecipient("")
      setDescription("")

      // Refresh transfers list
      fetchTransfers()
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send money. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestMoney = async () => {
    if (!requestAmount || !requestFrom) return

    setLoading(true)
    setMessage(null)

    try {
      // Simulate API call for money request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({
        type: "success",
        text: `Successfully requested $${requestAmount} from ${requestFrom}`,
      })

      // Reset form
      setRequestAmount("")
      setRequestFrom("")
      setRequestDescription("")

      // Refresh transfers list
      fetchTransfers()
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
                  <p className="text-xl font-semibold">${stats.monthlyReceived.toFixed(2)}</p>
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
                  <p className="text-xl font-semibold">${stats.monthlySent.toFixed(2)}</p>
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
                  <p className="text-xl font-semibold">${stats.pending.toFixed(2)}</p>
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
                  <div className="space-y-4">
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
                    <Button type="button" onClick={handleSendMoney} className="w-full" disabled={loading}>
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
                  </div>
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
                <div className="space-y-4 max-w-md">
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
                  <Button type="button" onClick={handleRequestMoney} className="w-full" disabled={loading}>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transfers</CardTitle>
            <CardDescription>Your transfer history from the database</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading transfers...</span>
              </div>
            ) : transfers.length === 0 ? (
              <div className="text-center py-12">
                <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any transfers yet. Start by sending money to someone or requesting a payment.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setActiveTab("send")} variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Send Money
                  </Button>
                  <Button onClick={() => setActiveTab("request")} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Request Money
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transaction) => (
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
                          <span>{formatDate(transaction.created_at)}</span>
                          {transaction.description && <span>• {transaction.description}</span>}
                          {transaction.reference_number && (
                            <span className="font-mono text-xs">#{transaction.reference_number}</span>
                          )}
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
            )}
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