export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  ssn: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  account_status: "pending" | "active" | "locked" | "suspended" | null
  created_at: string | null
  updated_at: string | null
  is_admin: boolean | null
  balance: number | null
}

export type Account = {
  id: string
  user_id: string
  account_type: string
  account_number: string
  balance: number
  created_at: string
}

export type Transaction = {
  id: string
  account_id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  description: string | null
  created_at: string
}

export type Card = {
  id: string
  user_id: string
  type: "debit" | "credit" | "virtual"
  name: string
  last4: string
  expiryDate: string
  status: "active" | "locked" | "expired"
  balance?: number
  creditLimit?: number
  spendingLimit?: number
  isVirtual?: boolean
}
