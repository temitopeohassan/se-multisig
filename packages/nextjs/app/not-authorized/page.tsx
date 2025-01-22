"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";

export default function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 rounded-full bg-destructive/10">
            <ShieldX className="w-12 h-12 text-destructive" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              Your wallet is not authorized to access this multisig wallet. Only registered owners can access the
              dashboard.
            </p>
          </div>

          <Link href="/" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
