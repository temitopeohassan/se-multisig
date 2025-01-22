"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { useMultiSigWallet } from "~~/hooks/useMultiSigWallet";

interface Transaction {
  id: bigint;
  to: string;
  value: bigint;
  data: `0x${string}`;
  executed: boolean;
  numConfirmations: bigint;
}

export function TransactionsList() {
  const { transactionCount, getTransaction, requiredSignatures, confirmTx, revokeTxConfirmation, executeTx } =
    useMultiSigWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!transactionCount) return;

      const txs: Transaction[] = [];
      for (let i = 0; i < Number(transactionCount); i++) {
        const tx = await getTransaction(i);
        if (tx) {
          // Transform the array response into our Transaction interface
          txs.push({
            id: BigInt(i),
            to: tx[0],
            value: tx[1],
            data: tx[2],
            executed: tx[3],
            numConfirmations: tx[4],
          });
        }
      }
      setTransactions(txs);
    };

    fetchTransactions();
  }, [transactionCount, getTransaction]);

  const handleConfirm = async (txId: bigint) => {
    try {
      await confirmTx(Number(txId));
    } catch (error) {
      console.error("Failed to confirm transaction:", error);
    }
  };

  const handleRevoke = async (txId: bigint) => {
    try {
      await revokeTxConfirmation(Number(txId));
    } catch (error) {
      console.error("Failed to revoke confirmation:", error);
    }
  };

  const handleExecute = async (txId: bigint) => {
    try {
      await executeTx(Number(txId));
    } catch (error) {
      console.error("Failed to execute transaction:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Value (ETH)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Confirmations</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(tx => (
            <TableRow key={tx.id.toString()}>
              <TableCell>{tx.id.toString()}</TableCell>
              <TableCell className="font-mono">{tx.to}</TableCell>
              <TableCell>{(Number(tx.value) / 1e18).toFixed(4)}</TableCell>
              <TableCell>
                <Badge variant={tx.executed ? "default" : "secondary"}>{tx.executed ? "Executed" : "Pending"}</Badge>
              </TableCell>
              <TableCell>
                {tx.numConfirmations.toString()}/{requiredSignatures?.toString()}
              </TableCell>
              <TableCell>
                {!tx.executed && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleConfirm(tx.id)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRevoke(tx.id)}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                    {Number(tx.numConfirmations) >= Number(requiredSignatures) && (
                      <Button size="sm" variant="default" onClick={() => handleExecute(tx.id)}>
                        Execute
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
