"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  ShieldCheck,
  Key,
  Smartphone,
  Bell,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react"

interface SecuritySetting {
  id: string
  title: string
  description: string
  enabled: boolean
  icon: React.ReactNode
}

export function SecurityCenter() {
  const [securityScore] = useState(85)
  const [settings, setSettings] = useState<SecuritySetting[]>([
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      enabled: true,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "Get notified when someone signs into your account",
      enabled: true,
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "transaction-alerts",
      title: "Transaction Alerts",
      description: "Receive notifications for all transactions",
      enabled: true,
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "privacy-mode",
      title: "Privacy Mode",
      description: "Hide sensitive information in public spaces",
      enabled: false,
      icon: <Eye className="w-4 h-4" />,
    },
    {
      id: "auto-lock",
      title: "Auto-Lock",
      description: "Automatically lock your session after inactivity",
      enabled: true,
      icon: <Lock className="w-4 h-4" />,
    },
  ])

  const toggleSetting = (settingId: string) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { text: "Good", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Needs Improvement", color: "bg-red-100 text-red-800" }
  }

  const securityChecks = [
    { name: "Strong Password", status: "complete", icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
    { name: "Two-Factor Authentication", status: "complete", icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
    { name: "Email Verification", status: "complete", icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
    { name: "Phone Verification", status: "complete", icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
    { name: "Identity Verification", status: "pending", icon: <AlertTriangle className="w-4 h-4 text-yellow-600" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Security Center</CardTitle>
                <CardDescription>
                  Manage your account security settings and monitor your security status
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Security Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Security</span>
                  <span className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</span>
                </div>
                <Progress value={securityScore} className="h-3" />
                <div className="mt-2">
                  <Badge className={getScoreStatus(securityScore).color}>{getScoreStatus(securityScore).text}</Badge>
                </div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}</div>
                <div className="text-sm text-gray-600">Security Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Security Checklist</CardTitle>
            <CardDescription>Complete these steps to improve your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {check.icon}
                    <span className="font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.status === "complete" ? (
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure your security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{setting.icon}</div>
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <Switch checked={setting.enabled} onCheckedChange={() => toggleSetting(setting.id)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Key className="w-6 h-6" />
                <span>Change Password</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Smartphone className="w-6 h-6" />
                <span>Manage Devices</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Shield className="w-6 h-6" />
                <span>View Activity Log</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
                <div>
                  <p className="font-medium">Successful login</p>
                  <p className="text-sm text-gray-600">iPhone 14 Pro • New York, NY</p>
                </div>
                <span className="text-sm text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
                <div>
                  <p className="font-medium">Password changed</p>
                  <p className="text-sm text-gray-600">Security settings updated</p>
                </div>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <div>
                  <p className="font-medium">New device detected</p>
                  <p className="text-sm text-gray-600">MacBook Pro • New York, NY</p>
                </div>
                <span className="text-sm text-gray-500">1 week ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
