"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Gamepad2,
  MoreHorizontal,
} from "lucide-react"

interface SpendingCategory {
  name: string
  amount: number
  percentage: number
  change: number
  icon: React.ReactNode
  color: string
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  savings: number
}

const spendingCategories: SpendingCategory[] = [
  {
    name: "Shopping",
    amount: 1250.3,
    percentage: 35,
    change: 12.5,
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "bg-blue-500",
  },
  {
    name: "Transportation",
    amount: 680.5,
    percentage: 19,
    change: -5.2,
    icon: <Car className="w-4 h-4" />,
    color: "bg-green-500",
  },
  {
    name: "Housing",
    amount: 850.0,
    percentage: 24,
    change: 0,
    icon: <Home className="w-4 h-4" />,
    color: "bg-purple-500",
  },
  {
    name: "Food & Dining",
    amount: 420.75,
    percentage: 12,
    change: 8.3,
    icon: <Utensils className="w-4 h-4" />,
    color: "bg-orange-500",
  },
  {
    name: "Entertainment",
    amount: 180.25,
    percentage: 5,
    change: -15.7,
    icon: <Gamepad2 className="w-4 h-4" />,
    color: "bg-pink-500",
  },
  {
    name: "Other",
    amount: 165.4,
    percentage: 5,
    change: 3.1,
    icon: <MoreHorizontal className="w-4 h-4" />,
    color: "bg-gray-500",
  },
]

const monthlyData: MonthlyData[] = [
  { month: "Jan", income: 5200, expenses: 3800, savings: 1400 },
  { month: "Feb", income: 5200, expenses: 4100, savings: 1100 },
  { month: "Mar", income: 5400, expenses: 3900, savings: 1500 },
  { month: "Apr", income: 5200, expenses: 4200, savings: 1000 },
  { month: "May", income: 5600, expenses: 3700, savings: 1900 },
  { month: "Jun", income: 5200, expenses: 4000, savings: 1200 },
]

const financialGoals = [
  {
    name: "Emergency Fund",
    target: 10000,
    current: 7500,
    deadline: "Dec 2024",
  },
  {
    name: "Vacation Fund",
    target: 3000,
    current: 1200,
    deadline: "Jun 2024",
  },
  {
    name: "New Car",
    target: 25000,
    current: 8500,
    deadline: "Mar 2025",
  },
]

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]

  const spendingChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
  const savingsChange = ((currentMonth.savings - previousMonth.savings) / previousMonth.savings) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Financial Analytics</CardTitle>
                <CardDescription>AI-powered insights into your spending patterns and financial health</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-xl font-semibold">${currentMonth.income.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Expenses</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold">${currentMonth.expenses.toLocaleString()}</p>
                    <Badge className={spendingChange > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {spendingChange > 0 ? "+" : ""}
                      {spendingChange.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Savings</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold">${currentMonth.savings.toLocaleString()}</p>
                    <Badge className={savingsChange > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {savingsChange > 0 ? "+" : ""}
                      {savingsChange.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Savings Rate</p>
                  <p className="text-xl font-semibold">
                    {((currentMonth.savings / currentMonth.income) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.slice(-3).map((month, index) => (
                      <div key={month.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{month.month} 2024</span>
                          <span className="text-gray-600">
                            Net: ${(month.income - month.expenses).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Income: ${month.income.toLocaleString()}</span>
                            <span>Expenses: ${month.expenses.toLocaleString()}</span>
                          </div>
                          <Progress value={(month.expenses / month.income) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Spending Optimization</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            You could save $180/month by reducing shopping expenses by 15%. Consider setting a monthly
                            shopping budget.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Goal Achievement</h4>
                          <p className="text-sm text-green-800 mt-1">
                            You're on track to reach your Emergency Fund goal 2 months early if you maintain current
                            savings rate.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <PieChart className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">Category Alert</h4>
                          <p className="text-sm text-orange-800 mt-1">
                            Food & Dining expenses increased 8.3% this month. Consider meal planning to reduce costs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Spending Tab */}
          <TabsContent value="spending">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Spending by Category
                  </CardTitle>
                  <CardDescription>Total spending: ${totalSpending.toLocaleString()} this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white`}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-gray-600">${category.amount.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{category.percentage}%</p>
                            <div className="flex items-center gap-1">
                              {category.change > 0 ? (
                                <ArrowUpRight className="w-3 h-3 text-red-500" />
                              ) : category.change < 0 ? (
                                <ArrowDownRight className="w-3 h-3 text-green-500" />
                              ) : null}
                              <span
                                className={`text-xs ${
                                  category.change > 0
                                    ? "text-red-600"
                                    : category.change < 0
                                      ? "text-green-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {category.change > 0 ? "+" : ""}
                                {category.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spending Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Weekly Spending</h4>
                      <div className="space-y-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                          const amount = Math.floor(Math.random() * 200) + 50
                          const maxAmount = 250
                          return (
                            <div key={day} className="flex items-center gap-3">
                              <span className="w-8 text-sm font-medium">{day}</span>
                              <div className="flex-1">
                                <Progress value={(amount / maxAmount) * 100} className="h-3" />
                              </div>
                              <span className="w-16 text-sm text-right">${amount}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Top Merchants</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Amazon", amount: 245.3, transactions: 8 },
                          { name: "Starbucks", amount: 89.5, transactions: 12 },
                          { name: "Shell Gas", amount: 156.2, transactions: 6 },
                          { name: "Target", amount: 198.75, transactions: 4 },
                        ].map((merchant, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{merchant.name}</p>
                              <p className="text-sm text-gray-600">{merchant.transactions} transactions</p>
                            </div>
                            <span className="font-semibold">${merchant.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Financial Goals
                  </CardTitle>
                  <CardDescription>Track your progress towards your financial objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {financialGoals.map((goal, index) => {
                      const progress = (goal.current / goal.target) * 100
                      const remaining = goal.target - goal.current

                      return (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">{goal.name}</h4>
                                <p className="text-sm text-gray-600">Target: {goal.deadline}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>${goal.current.toLocaleString()}</span>
                                  <span>${goal.target.toLocaleString()}</span>
                                </div>
                                <Progress value={progress} className="h-3" />
                                <p className="text-xs text-gray-600">{progress.toFixed(1)}% complete</p>
                              </div>

                              <div className="pt-2 border-t">
                                <p className="text-sm">
                                  <span className="font-medium">${remaining.toLocaleString()}</span>
                                  <span className="text-gray-600"> remaining</span>
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Automate Savings</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Set up automatic transfers to reach your Emergency Fund goal faster.
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Recommended: $500/month</Badge>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">High-Yield Savings</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Move your emergency fund to a high-yield account for better returns.
                      </p>
                      <Badge className="bg-green-100 text-green-800">Potential: +$180/year</Badge>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Investment Opportunity</h4>
                      <p className="text-sm text-purple-800 mb-3">
                        Consider investing surplus savings for long-term goals.
                      </p>
                      <Badge className="bg-purple-100 text-purple-800">Risk: Moderate</Badge>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Budget Optimization</h4>
                      <p className="text-sm text-orange-800 mb-3">
                        Reduce discretionary spending to accelerate goal achievement.
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">Save: $200/month</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
