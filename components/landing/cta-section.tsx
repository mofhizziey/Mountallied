"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Shield, Clock, Award } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Experience the Future of Banking?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have already made the switch to smarter, safer, and more
            convenient banking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">5-Minute Setup</h3>
              <p className="text-blue-100">
                Open your account in minutes, not hours. Our streamlined process gets you banking faster.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-blue-100">
                Your money and data are protected by the same security used by major financial institutions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Award-Winning Support</h3>
              <p className="text-blue-100">
                24/7 customer support that actually cares about solving your problems quickly.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                Open Your Account Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                Sign In to Existing Account
              </Button>
            </Link>
          </div>

          <p className="text-blue-100 text-sm">No hidden fees • FDIC Insured • Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
