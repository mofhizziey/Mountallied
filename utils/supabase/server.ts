import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method was called from a Server Component.
          // This can be ignored if you have middleware that will refresh it.
          console.warn("Could not set cookie from Server Component:", error)
        }
      },
      remove(name: string) {
        try {
          cookieStore.set({ name, value: "", expires: new Date(0) })
        } catch (error) {
          // This can be ignored if you have middleware that will refresh it.
          console.warn("Could not remove cookie from Server Component:", error)
        }
      },
    },
  })
}
