"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Eye, EyeOff } from "lucide-react"
import type { Profile, Account } from "@/lib/types"
import { useState } from "react"

interface DashboardContentProps {
  profile: Profile | null
  accounts: Account[]
}

export function DashboardContent({ profile, accounts }: DashboardContentProps) {
  const [showBalances, setShowBalances] = useState(true)

  if (!profile) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const checkingAccount = accounts.find((acc) => acc.account_type === "checking")
  const savingsAccount = accounts.find((acc) => acc.account_type === "savings")
  const creditAccount = accounts.find((acc) => acc.account_type === "credit")

  const totalBalance = (checkingAccount?.balance || 0) + (savingsAccount?.balance || 0)
  const availableCredit = creditAccount ? (creditAccount.credit_limit || 0) - Math.abs(creditAccount.balance || 0) : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "locked":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile.first_name || "User"}!</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your accounts today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(profile.account_status)}>{profile.account_status}</Badge>
            <Button variant="outline" size="sm" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="ml-2">{showBalances ? "Hide" : "Show"} Balances</span>
            </Button>
          </div>
        </div>

        {/* Account Status Alert */}
        {profile.account_status === "pending" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-medium text-yellow-800">Account Under Review</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your account is currently being reviewed by our team. Full banking features will be available once
                    approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Balance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{showBalances ? formatCurrency(totalBalance) : "••••••"}</div>
              <p className="text-xs text-muted-foreground">Checking + Savings</p>
            </CardContent>
          </Card>

          {/* Checking Account */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checking</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalances ? formatCurrency(checkingAccount?.balance || 0) : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">****{checkingAccount?.account_number.slice(-4) || "0000"}</p>
            </CardContent>
          </Card>

          {/* Savings Account */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalances ? formatCurrency(savingsAccount?.balance || 0) : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground">****{savingsAccount?.account_number.slice(-4) || "0000"}</p>
            </CardContent>
          </Card>

          {/* Available Credit */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{showBalances ? formatCurrency(availableCredit) : "••••••"}</div>
              <p className="text-xs text-muted-foreground">
                of {showBalances ? formatCurrency(creditAccount?.credit_limit || 0) : "••••••"} limit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common banking tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                <ArrowUpRight className="w-6 h-6" />
                <span className="text-sm">Transfer Money</span>
              </Button>
              <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Deposit Check</span>
              </Button>
              <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Pay Bills</span>
              </Button>
              <Button className="h-20 flex-col space-y-2 bg-transparent" variant="outline">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowDownRight className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Opening Bonus</p>
                      <p className="text-xs text-gray-500">Welcome to WallmountAlliedBank</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">+$0.00</span>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent transactions</p>
                  <p className="text-xs mt-1">Your transaction history will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Health */}
          <Card>
            <CardHeader>
              <CardTitle>Account Health</CardTitle>
              <CardDescription>Your banking profile status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-gray-500">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Add a profile photo to complete</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Security Score</span>
                  <span className="text-sm text-gray-500">Good</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Enable 2FA for better security</p>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full bg-transparent">
                  View Security Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
