import type { User } from '@supabase/supabase-js'
import { SignOutButton } from './auth-button'

interface UserNavProps {
  user: User | null
}

export function UserNav({ user }: UserNavProps) {
  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-muted-foreground">
        {user.email}
      </p>
      <SignOutButton />
    </div>
  )
}