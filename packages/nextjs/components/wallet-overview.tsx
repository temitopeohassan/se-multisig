"use client";

import { Button } from "./ui/button";
import { ArrowUpDown, Copy, ExternalLink, ShieldCheck, Users, Wallet } from "lucide-react";
import { useBalance } from "wagmi";
import { Card } from "~~/components/ui/card";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useMultiSigWallet } from "~~/hooks/useMultiSigWallet";
import { notification } from "~~/utils/scaffold-eth";

export function WalletOverview() {
  const { owners, requiredSignatures, transactionCount } = useMultiSigWallet();
  const { data: contractInfo } = useDeployedContractInfo("MultiSigWallet");
  const { data: balance } = useBalance({
    address: contractInfo?.address,
  });

  const copyAddress = async () => {
    if (contractInfo?.address) {
      await navigator.clipboard.writeText(contractInfo.address);
      notification.success("Address copied to clipboard!");
    }
  };

  const openEtherscan = () => {
    if (contractInfo?.address) {
      window.open(`https://sepolia.etherscan.io/address/${contractInfo.address}`, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MultiSig Wallet</h1>
        <div className="flex items-center space-x-2">
          <code className="px-2 py-1 bg-secondary rounded text-sm">{contractInfo?.address}</code>
          <Button variant="ghost" size="icon" onClick={copyAddress}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={openEtherscan}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold">
              {balance ? `${Number(balance?.formatted).toFixed(4)} ${balance?.symbol}` : "Loading..."}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Owners</p>
            <p className="text-2xl font-bold">{owners ? owners.length : "Loading..."}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Required Signatures</p>
            <p className="text-2xl font-bold">{requiredSignatures ? requiredSignatures.toString() : "Loading..."}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ArrowUpDown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{transactionCount ? transactionCount.toString() : "Loading..."}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
