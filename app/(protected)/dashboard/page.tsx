import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/auth/user-nav'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back!</p>
        </div>
        <UserNav user={user} />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  User ID
                </dt>
                <dd className="font-mono text-xs">{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Created
                </dt>
                <dd className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
            <Button className="w-full" variant="outline">
              Account Settings
            </Button>
            <Button className="w-full" variant="outline">
              View Activity
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful links and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="https://supabase.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full" variant="outline">
                Supabase Docs
              </Button>
            </Link>
            <Link
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full" variant="outline">
                Next.js Docs
              </Button>
            </Link>
            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full" variant="outline">
                shadcn/ui Docs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>
          <CardDescription>
            This content is only visible to authenticated users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You&apos;re successfully authenticated and can access protected
            routes. This dashboard demonstrates how to create protected pages
            that require authentication.
          </p>
          <div className="mt-4 rounded-lg bg-muted p-4">
            <h3 className="mb-2 font-semibold">Next Steps:</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Customize this dashboard with your application&apos;s features
              </li>
              <li>Add more protected routes in the (protected) folder</li>
              <li>Implement user profile management</li>
              <li>Connect to your Supabase database tables</li>
              <li>Build out your application&apos;s core functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
