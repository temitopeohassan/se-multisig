'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletConnectProps {
  onConnect: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">MultiSig Wallet</h1>
            <p className="text-muted-foreground">
              Connect your wallet to access the multisig dashboard
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={onConnect}
          >
            Connect Wallet
          </Button>
        </div>
      </Card>
    </div>
  );
}