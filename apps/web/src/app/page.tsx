import { Button } from "@saas-portal/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">SaaS Project Portal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Multi-tenant project management platform with documents, tasks, 
            finances, approvals, and real-time collaboration
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}