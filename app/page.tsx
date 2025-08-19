import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserNav } from '@/components/auth/user-nav'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Next.js Starter Template</h1>
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
      </header>

      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Next.js 15</CardTitle>
            <CardDescription>
              Built with the latest Next.js App Router
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Server Components, Streaming, and Suspense for optimal performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔐 Supabase Auth</CardTitle>
            <CardDescription>
              Complete authentication system ready to go
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email/password auth with protected routes and session management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎨 shadcn/ui</CardTitle>
            <CardDescription>
              Beautiful, accessible UI components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customizable components built with Radix UI and Tailwind CSS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Form Handling</CardTitle>
            <CardDescription>
              React Hook Form + Zod validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Type-safe forms with comprehensive validation and error handling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✨ TypeScript</CardTitle>
            <CardDescription>
              End-to-end type safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Strict TypeScript configuration for robust, maintainable code
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛠️ Developer Experience</CardTitle>
            <CardDescription>
              ESLint, Prettier, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pre-configured tooling for consistent, high-quality code
            </p>
          </CardContent>
        </Card>
      </main>

      <section className="mt-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Ready to Build?</h2>
        <p className="mb-6 text-muted-foreground">
          {user 
            ? "You're signed in! Check out the dashboard to see protected content."
            : "Sign up or sign in to access the full application features."}
        </p>
        {user ? (
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        ) : (
          <Link href="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        )}
      </section>
    </div>
  )
}