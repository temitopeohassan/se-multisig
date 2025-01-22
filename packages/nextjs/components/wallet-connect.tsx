"use client";

import { Wallet } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import { notification } from "~~/utils/scaffold-eth";

interface WalletConnectProps {
  onConnect: () => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const { connect, connectors, error } = useConnect();
  const { isConnected } = useAccount();

  const handleConnect = async () => {
    try {
      // Get the first available connector (usually injected - metamask)
      const connector = connectors[0];
      if (connector) {
        await connect({ connector });
        onConnect();
      } else {
        notification.error("No wallet found. Please install MetaMask or another web3 wallet.");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      notification.error("Failed to connect wallet. Please try again.");
    }
  };

  // If already connected, trigger the callback
  if (isConnected) {
    onConnect();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Wallet className="w-12 h-12 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">MultiSig Wallet</h1>
            <p className="text-muted-foreground">Connect your wallet to access the multisig dashboard</p>
          </div>

          <Button size="lg" className="w-full" onClick={handleConnect}>
            Connect Wallet
          </Button>

          {error && <p className="text-sm text-destructive text-center">{error.message}</p>}
        </div>
      </Card>
    </div>
  );
}
