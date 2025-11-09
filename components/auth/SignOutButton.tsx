'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-biblical-deepBrown text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all font-semibold flex items-center gap-2"
    >
      <LogOut size={20} />
      Sign Out
    </button>
  )
}
