"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { WalletConnect } from "~~/components/wallet-connect";
import { useMultiSigWallet } from "~~/hooks/useMultiSigWallet";

const Home: NextPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isOwner } = useMultiSigWallet();

  useEffect(() => {
    if (isConnected && address) {
      if (isOwner()) {
        router.push("/dashboard");
      } else {
        router.push("/not-authorized");
      }
    }
  }, [isConnected, address, isOwner, router]);

  if (!isConnected) {
    return (
      <main>
        <WalletConnect onConnect={() => {}} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </main>
  );
};

export default Home;
