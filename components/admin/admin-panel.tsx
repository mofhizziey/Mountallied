"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Users, DollarSign, CreditCard, TrendingUp, Edit, Search } from "lucide-react"
import type { Profile, Account } from "@/lib/types"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  totalBalance: number
  totalAccounts: number
}

export function AdminPanel() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalBalance: 0,
    totalAccounts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [newBalance, setNewBalance] = useState("")
  const [balanceDescription, setBalanceDescription] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profilesError) throw profilesError

      // Fetch accounts with user info
      const { data: accountsData, error: accountsError } = await supabase
        .from("accounts")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (accountsError) throw accountsError

      setProfiles(profilesData || [])
      setAccounts(accountsData || [])

      // Calculate stats
      const totalUsers = profilesData?.length || 0
      const activeUsers = profilesData?.filter((p) => p.account_status === "active").length || 0
      const pendingUsers = profilesData?.filter((p) => p.account_status === "pending").length || 0
      const totalBalance = accountsData?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0
      const totalAccounts = accountsData?.length || 0

      setStats({
        totalUsers,
        activeUsers,
        pendingUsers,
        totalBalance,
        totalAccounts,
      })
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ account_status: newStatus }).eq("id", userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User status updated successfully",
      })

      fetchData()
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const updateAccountBalance = async () => {
    if (!selectedAccount || !newBalance) return

    try {
      setIsUpdating(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase.rpc("admin_update_account_balance", {
        account_id_param: selectedAccount.id,
        new_balance: Number.parseFloat(newBalance),
        admin_user_id: user.id,
        transaction_description: balanceDescription || "Admin balance adjustment",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Account balance updated successfully",
      })

      setSelectedAccount(null)
      setNewBalance("")
      setBalanceDescription("")
      fetchData()
    } catch (error) {
      console.error("Error updating balance:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update balance",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAccounts = accounts.filter((account) => {
    const profile = account.profiles as any
    return (
      account.account_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={fetchData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccounts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users or accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users Management</TabsTrigger>
          <TabsTrigger value="accounts">Accounts Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        {profile.first_name} {profile.last_name}
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profile.account_status === "active"
                              ? "default"
                              : profile.account_status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {profile.account_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.is_admin ? "default" : "outline"}>
                          {profile.is_admin ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => updateUserStatus(profile.id, value)}
                          defaultValue={profile.account_status}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="locked">Locked</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage user accounts and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => {
                    const profile = account.profiles as any
                    return (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono">{account.account_number}</TableCell>
                        <TableCell>
                          {profile?.first_name} {profile?.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              account.account_type === "checking"
                                ? "default"
                                : account.account_type === "savings"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {account.account_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">${account.balance?.toLocaleString() || "0.00"}</TableCell>
                        <TableCell className="font-mono">
                          ${account.available_balance?.toLocaleString() || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={account.is_active ? "default" : "destructive"}>
                            {account.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAccount(account)
                                  setNewBalance(account.balance?.toString() || "0")
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Account Balance</DialogTitle>
                                <DialogDescription>
                                  Update the balance for account {account.account_number}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="balance">New Balance</Label>
                                  <Input
                                    id="balance"
                                    type="number"
                                    step="0.01"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    value={balanceDescription}
                                    onChange={(e) => setBalanceDescription(e.target.value)}
                                    placeholder="Reason for balance adjustment..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={updateAccountBalance} disabled={isUpdating}>
                                  {isUpdating ? "Updating..." : "Update Balance"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
