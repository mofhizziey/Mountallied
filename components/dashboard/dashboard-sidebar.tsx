"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Home,
  CreditCard,
  ArrowUpDown,
  PieChart,
  User,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"

interface DashboardSidebarProps {
  profile: Profile | null
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
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

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/cards", icon: CreditCard, label: "Cards" },
    { href: "/transfers", icon: ArrowUpDown, label: "Transfers" },
    { href: "/analytics", icon: PieChart, label: "Analytics" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/security/center", icon: Shield, label: "Security" },
  ]

  if (!profile) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PP</span>
                </div>
                <span className="font-semibold text-gray-900">WallmountAlliedBank</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {profile.first_name?.[0] || "U"}
                {profile.last_name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.first_name || "User"} {profile.last_name || ""}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(profile.account_status)}`}>
                    {profile.account_status}
                  </Badge>
                  {profile.is_admin && (
                    <Badge variant="outline" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Admin Panel Link */}
        {profile.is_admin && (
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm font-medium">Admin Panel</span>}
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
