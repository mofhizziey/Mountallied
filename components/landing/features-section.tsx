"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Smartphone, Shield, CreditCard, TrendingUp, Zap, Bell, BarChart3, Wallet } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Selfie Verification",
    description: "Advanced biometric authentication using facial recognition technology for secure account access.",
    badge: "New",
    color: "bg-green-500",
  },
  {
    icon: Smartphone,
    title: "Device Management",
    description: "Monitor and control all devices connected to your account with real-time security alerts.",
    badge: "Enhanced",
    color: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Multi-Layer Security",
    description: "Bank-grade encryption, fraud detection, and real-time monitoring protect your assets 24/7.",
    badge: "Premium",
    color: "bg-purple-500",
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Send money instantly to anyone, anywhere with our lightning-fast transfer system.",
    badge: null,
    color: "bg-yellow-500",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "AI-powered insights help you understand spending patterns and optimize your finances.",
    badge: "AI-Powered",
    color: "bg-indigo-500",
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    description: "Generate virtual cards instantly for online purchases with customizable spending limits.",
    badge: null,
    color: "bg-pink-500",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Intelligent alerts for transactions, budgets, and account activity tailored to your preferences.",
    badge: null,
    color: "bg-orange-500",
  },
  {
    icon: BarChart3,
    title: "Investment Tracking",
    description: "Monitor your portfolio performance and get personalized investment recommendations.",
    badge: "Coming Soon",
    color: "bg-teal-500",
  },
  {
    icon: Wallet,
    title: "Digital Wallet",
    description: "Store cards, loyalty programs, and payment methods in one secure digital wallet.",
    badge: null,
    color: "bg-red-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Banking</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience banking like never before with our cutting-edge features designed to make your financial life
            simpler, safer, and smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
