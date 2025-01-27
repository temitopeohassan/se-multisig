"use client";

import { useState } from "react";
import { CreateTransaction } from "./create-transaction";
import { OwnersManagement } from "./owners-management";
import { TransactionsList } from "./transactions-list";
import { WalletConnect } from "./wallet-connect";
import { WalletOverview } from "./wallet-overview";
import { Card } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

export function WalletDashboard() {
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return <WalletConnect onConnect={() => setIsConnected(true)} />;
  }

  return (
    <div className="container mx-auto py-8">
      <WalletOverview />

      <Tabs defaultValue="transactions" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="create">Create Transaction</TabsTrigger>
          <TabsTrigger value="owners">Owners</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="p-6">
            <TransactionsList />
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="p-6">
            <CreateTransaction />
          </Card>
        </TabsContent>

        <TabsContent value="owners">
          <Card className="p-6">
            <OwnersManagement />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
