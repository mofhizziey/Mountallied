"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Smartphone, Shield, Lock, Eye, CheckCircle } from "lucide-react"

export function SecuritySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-100 text-red-800 hover:bg-red-100">
            <Shield className="w-4 h-4 mr-2" />
            Advanced Security
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your Security is Our Priority</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Multi-layered protection with cutting-edge biometric technology and real-time monitoring keeps your money
            safe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Security features */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Selfie Verification */}
              <Card className="border-l-4 border-l-green-500 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Selfie Verification</h3>
                      <p className="text-gray-600 mb-3">
                        Advanced facial recognition technology verifies your identity in seconds. No more passwords to
                        remember - just look at your camera.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          99.9% Accuracy
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          2-Second Verification
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Management */}
              <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Device Management</h3>
                      <p className="text-gray-600 mb-3">
                        Monitor all devices connected to your account. Get instant alerts for new logins and remotely
                        disable suspicious devices.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          Real-time Monitoring
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          Remote Control
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Security */}
              <Card className="border-l-4 border-l-purple-500 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Factor Authentication</h3>
                      <p className="text-gray-600 mb-3">
                        Combine biometrics, device recognition, and behavioral analysis for unbreakable security.
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          256-bit Encryption
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          Zero-Trust Architecture
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Learn More About Security
            </Button>
          </div>

          {/* Right side - Security dashboard mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Center</h3>
                <Badge className="bg-green-100 text-green-800">All Systems Secure</Badge>
              </div>

              <div className="space-y-4">
                {/* Selfie Verification Status */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Selfie Verification</div>
                      <div className="text-sm text-gray-600">Last verified: 2 minutes ago</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                {/* Device Status */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Trusted Devices</div>
                      <div className="text-sm text-gray-600">3 devices registered</div>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                {/* Security Score */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Security Score</span>
                    <span className="text-2xl font-bold text-green-600">98/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Recent Security Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Login from iPhone</span>
                      <span className="text-green-600">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">New device registered</span>
                      <span className="text-blue-600">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating security badges */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg animate-pulse">
              <Lock className="w-4 h-4" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg animate-bounce">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
