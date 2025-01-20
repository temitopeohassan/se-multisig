"use client";

import { ArrowUpDown, ShieldCheck, Users, Wallet } from "lucide-react";
import { Card } from "~~/components/ui/card";

export function WalletOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold">2.5 ETH</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Owners</p>
          <p className="text-2xl font-bold">3/5</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Required Signatures</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <ArrowUpDown className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pending Transactions</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </Card>
    </div>
  );
}
