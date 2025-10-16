import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/auth/user-nav'
import type { User } from '@supabase/supabase-js'

interface LandingHeaderProps {
  user: User | null
}

export function LandingHeader({ user }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            FAQ
          </Link>
        </nav>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold"
        >
          YourBrand
        </Link>
        {user ? (
          <UserNav user={user} />
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
