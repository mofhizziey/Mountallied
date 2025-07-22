"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Smartphone, CreditCard } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                Bank-Grade Security
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Banking
                <span className="text-blue-600"> Reimagined</span>
                <br />
                for the Digital Age
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the future of banking with WallmountAllied. Advanced security, intelligent features, and
                seamless digital experiences designed for modern life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Open Account Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">256-bit</div>
                <div className="text-sm text-gray-600">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">FDIC</div>
                <div className="text-sm text-gray-600">Insured</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right content - Dashboard preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Total Balance</span>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold">$12,847.50</div>
                <div className="text-sm opacity-90">+2.5% from last month</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-medium">Income</div>
                  <div className="text-lg font-bold text-green-700">$4,200</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm text-purple-600 font-medium">Credit</div>
                  <div className="text-lg font-bold text-purple-700">$7,500</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">Quick Transfer</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">Mobile Deposit</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
              <Shield className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
