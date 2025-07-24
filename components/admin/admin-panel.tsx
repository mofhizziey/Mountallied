"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Users, DollarSign, CreditCard, TrendingUp, Edit, Search } from "lucide-react"
import type { Profile, Account } from "@/lib/types"
import { Switch } from "@/components/ui/switch" // Import Switch for is_admin toggle
import { format } from "date-fns" // Import format for date handling

interface AdminStats {
  totalUsers: number
  activeUsers: number
  pendingUsers: number
  totalBalance: number
  totalAccounts: number
}

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

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

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [editProfileData, setEditProfileData] = useState<Partial<Profile>>({})
  const [isEditingProfile, setIsEditingProfile] = useState(false)

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

  const updateUserStatus = async (userId: string, newStatus: Profile["account_status"]) => {
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

  const handleEditProfileClick = (profile: Profile) => {
    setSelectedProfile(profile)
    // Convert date_of_birth to 'YYYY-MM-DD' string for input type="date"
    const dobString = profile.date_of_birth ? format(new Date(profile.date_of_birth), "yyyy-MM-dd") : ""
    setEditProfileData({ ...profile, date_of_birth: dobString })
    setIsEditingProfile(false) // Reset loading state for dialog
  }

  const handleProfileInputChange = (field: keyof Profile, value: string | boolean) => {
    setEditProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdateProfile = async () => {
    if (!selectedProfile || !editProfileData.id) return

    try {
      setIsEditingProfile(true) // Set loading state during update

      // Prepare data for update, converting date_of_birth back to ISO string if it was changed
      const updatedData: Partial<Profile> = {
        first_name: editProfileData.first_name,
        last_name: editProfileData.last_name,
        email: editProfileData.email,
        phone: editProfileData.phone,
        address_line1: editProfileData.address_line1,
        address_line2: editProfileData.address_line2,
        city: editProfileData.city,
        state: editProfileData.state,
        zip_code: editProfileData.zip_code,
        country: editProfileData.country,
        is_admin: editProfileData.is_admin,
        // Convert date string back to ISO format for database
        date_of_birth: editProfileData.date_of_birth
          ? format(new Date(editProfileData.date_of_birth), "yyyy-MM-dd")
          : null,
        ssn: editProfileData.ssn,
      }

      const { error } = await supabase.from("profiles").update(updatedData).eq("id", selectedProfile.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "User profile updated successfully",
      })
      setSelectedProfile(null)
      setEditProfileData({})
      // DialogClose will handle closing the dialog
      fetchData() // Re-fetch data to show updated profile
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsEditingProfile(false)
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
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => updateUserStatus(profile.id, value as Profile["account_status"])}
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditProfileClick(profile)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Edit User Profile</DialogTitle>
                                <DialogDescription>
                                  Make changes to {selectedProfile?.first_name} {selectedProfile?.last_name}'s profile.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-first-name">First Name</Label>
                                  <Input
                                    id="edit-first-name"
                                    value={editProfileData.first_name || ""}
                                    onChange={(e) => handleProfileInputChange("first_name", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-last-name">Last Name</Label>
                                  <Input
                                    id="edit-last-name"
                                    value={editProfileData.last_name || ""}
                                    onChange={(e) => handleProfileInputChange("last_name", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-email">Email</Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editProfileData.email || ""}
                                    onChange={(e) => handleProfileInputChange("email", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-phone">Phone</Label>
                                  <Input
                                    id="edit-phone"
                                    value={editProfileData.phone || ""}
                                    onChange={(e) => handleProfileInputChange("phone", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-dob">Date of Birth</Label>
                                  <Input
                                    id="edit-dob"
                                    type="date"
                                    value={editProfileData.date_of_birth || ""}
                                    onChange={(e) => handleProfileInputChange("date_of_birth", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-ssn">SSN</Label>
                                  <Input
                                    id="edit-ssn"
                                    value={editProfileData.ssn || ""}
                                    onChange={(e) => handleProfileInputChange("ssn", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-address1">Address Line 1</Label>
                                  <Input
                                    id="edit-address1"
                                    value={editProfileData.address_line1 || ""}
                                    onChange={(e) => handleProfileInputChange("address_line1", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="edit-address2">Address Line 2</Label>
                                  <Input
                                    id="edit-address2"
                                    value={editProfileData.address_line2 || ""}
                                    onChange={(e) => handleProfileInputChange("address_line2", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-city">City</Label>
                                  <Input
                                    id="edit-city"
                                    value={editProfileData.city || ""}
                                    onChange={(e) => handleProfileInputChange("city", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-state">State</Label>
                                  <Select
                                    value={editProfileData.state || ""}
                                    onValueChange={(value) => handleProfileInputChange("state", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {states.map((s) => (
                                        <SelectItem key={s} value={s}>
                                          {s}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-zipcode">ZIP Code</Label>
                                  <Input
                                    id="edit-zipcode"
                                    value={editProfileData.zip_code || ""}
                                    onChange={(e) => handleProfileInputChange("zip_code", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-country">Country</Label>
                                  <Input
                                    id="edit-country"
                                    value={editProfileData.country || ""}
                                    onChange={(e) => handleProfileInputChange("country", e.target.value)}
                                  />
                                </div>
                                <div className="flex items-center space-x-2 col-span-2">
                                  <Switch
                                    id="is-admin"
                                    checked={editProfileData.is_admin || false}
                                    onCheckedChange={(checked) => handleProfileInputChange("is_admin", checked)}
                                  />
                                  <Label htmlFor="is-admin">Is Admin</Label>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" onClick={handleUpdateProfile} disabled={isEditingProfile}>
                                  {isEditingProfile ? "Saving..." : "Save changes"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
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
