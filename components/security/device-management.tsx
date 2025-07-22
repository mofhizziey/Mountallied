"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Monitor, Tablet, Shield, ShieldAlert, MapPin, Clock, Trash2, AlertTriangle } from "lucide-react"

interface Device {
  id: string
  name: string
  type: "mobile" | "desktop" | "tablet"
  trusted: boolean
  lastActive: string
  location: string
  ipAddress: string
  browser?: string
  os?: string
}

const mockDevices: Device[] = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    type: "mobile",
    trusted: true,
    lastActive: "2 minutes ago",
    location: "New York, NY",
    ipAddress: "192.168.1.100",
    browser: "Safari",
    os: "iOS 17.1",
  },
  {
    id: "2",
    name: "MacBook Pro",
    type: "desktop",
    trusted: true,
    lastActive: "1 hour ago",
    location: "New York, NY",
    ipAddress: "192.168.1.101",
    browser: "Chrome",
    os: "macOS Sonoma",
  },
  {
    id: "3",
    name: "iPad Air",
    type: "tablet",
    trusted: true,
    lastActive: "1 day ago",
    location: "New York, NY",
    ipAddress: "192.168.1.102",
    browser: "Safari",
    os: "iPadOS 17.1",
  },
  {
    id: "4",
    name: "Unknown Device",
    type: "desktop",
    trusted: false,
    lastActive: "3 days ago",
    location: "Los Angeles, CA",
    ipAddress: "203.0.113.45",
    browser: "Firefox",
    os: "Windows 11",
  },
]

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const getDeviceIcon = (type: Device["type"]) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-5 h-5" />
      case "tablet":
        return <Tablet className="w-5 h-5" />
      case "desktop":
        return <Monitor className="w-5 h-5" />
    }
  }

  const toggleTrust = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, trusted: !device.trusted } : device)),
    )
    setMessage({
      type: "success",
      text: "Device trust status updated successfully",
    })
    setTimeout(() => setMessage(null), 3000)
  }

  const removeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== deviceId))
    setMessage({
      type: "success",
      text: "Device removed successfully",
    })
    setTimeout(() => setMessage(null), 3000)
  }

  const trustedDevices = devices.filter((d) => d.trusted)
  const untrustedDevices = devices.filter((d) => !d.trusted)

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
                <CardTitle className="text-2xl">Device Management</CardTitle>
                <CardDescription>Monitor and control devices that have access to your account</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Security Alert */}
        {untrustedDevices.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You have {untrustedDevices.length} untrusted device(s) that recently accessed your account. Review and
              secure your account if these devices are not yours.
            </AlertDescription>
          </Alert>
        )}

        {/* Trusted Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Trusted Devices ({trustedDevices.length})
            </CardTitle>
            <CardDescription>These devices are authorized to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trustedDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-green-600">{getDeviceIcon(device.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{device.name}</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Trusted
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {device.lastActive}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {device.location}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {device.browser} • {device.os} • {device.ipAddress}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleTrust(device.id)}>
                    Remove Trust
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeDevice(device.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Untrusted Devices */}
        {untrustedDevices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Untrusted Devices ({untrustedDevices.length})
              </CardTitle>
              <CardDescription>These devices have accessed your account but are not trusted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {untrustedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-red-600">{getDeviceIcon(device.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{device.name}</h4>
                        <Badge variant="destructive">Untrusted</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {device.lastActive}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {device.location}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {device.browser} • {device.os} • {device.ipAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleTrust(device.id)}>
                      Trust Device
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeDevice(device.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Keep Your Account Safe:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Regularly review your trusted devices</li>
                  <li>• Remove devices you no longer use</li>
                  <li>• Don't trust public or shared computers</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">If You See Unknown Devices:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Remove them immediately</li>
                  <li>• Change your password</li>
                  <li>• Contact support if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success/Error Messages */}
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
