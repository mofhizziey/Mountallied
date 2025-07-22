"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, CreditCard, PiggyBank, TrendingUp } from "lucide-react"
import Link from "next/link"

const accountTypes = [
  {
    name: "Essential Checking",
    description: "Perfect for everyday banking needs",
    icon: CreditCard,
    price: "$0",
    period: "Monthly Fee",
    features: [
      "No minimum balance",
      "Free online banking",
      "Mobile check deposit",
      "24/7 customer support",
      "Debit card included",
      "ATM fee reimbursement",
    ],
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Premier Savings",
    description: "Grow your money with competitive rates",
    icon: PiggyBank,
    price: "2.5%",
    period: "APY",
    features: [
      "High-yield savings account",
      "No monthly maintenance fees",
      "Automatic savings tools",
      "Goal-based savings",
      "Round-up savings",
      "Priority customer support",
    ],
    popular: true,
    color: "border-blue-500",
  },
  {
    name: "Investment Account",
    description: "Build wealth with smart investing",
    icon: TrendingUp,
    price: "$0",
    period: "Commission",
    features: [
      "Commission-free trades",
      "Robo-advisor included",
      "Portfolio rebalancing",
      "Tax-loss harvesting",
      "Research & analytics",
      "Retirement planning",
    ],
    popular: false,
    color: "border-gray-200",
  },
]

export function AccountsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Account</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're saving for the future, managing daily expenses, or building wealth, we have the right account
            for your financial goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {accountTypes.map((account, index) => (
            <Card
              key={index}
              className={`relative ${account.color} ${account.popular ? "ring-2 ring-blue-500 shadow-xl scale-105" : "shadow-lg"} hover:shadow-xl transition-all duration-300`}
            >
              {account.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-3 rounded-xl ${account.popular ? "bg-blue-100" : "bg-gray-100"} w-fit mb-4`}>
                  <account.icon className={`w-8 h-8 ${account.popular ? "text-blue-600" : "text-gray-600"}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{account.name}</CardTitle>
                <CardDescription className="text-gray-600">{account.description}</CardDescription>
                <div className="pt-4">
                  <div className="text-4xl font-bold text-gray-900">{account.price}</div>
                  <div className="text-sm text-gray-600">{account.period}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {account.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button
                    className={`w-full ${account.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"} text-white`}
                    size="lg"
                  >
                    Open {account.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All accounts are FDIC insured up to $250,000</p>
          <Button variant="outline" size="lg">
            Compare All Account Types
          </Button>
        </div>
      </div>
    </section>
  )
}
