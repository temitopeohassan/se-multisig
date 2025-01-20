"use client";

import type { NextPage } from "next";
import { WalletDashboardWrapper } from "~~/components/wallet-dashboard-wrapper";

const Home: NextPage = () => {
  return (
    <main>
      <WalletDashboardWrapper />
    </main>
  );
};

export default Home;
