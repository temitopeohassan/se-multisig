"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";

const transactions = [
  {
    id: "1",
    type: "Transfer",
    amount: "1.5 ETH",
    to: "0x1234...5678",
    status: "Pending",
    signatures: 1,
    required: 2,
  },
  {
    id: "2",
    type: "Add Owner",
    amount: "-",
    to: "0x8765...4321",
    status: "Executed",
    signatures: 2,
    required: 2,
  },
  {
    id: "3",
    type: "Transfer",
    amount: "0.5 ETH",
    to: "0x9876...1234",
    status: "Rejected",
    signatures: 1,
    required: 2,
  },
];

export function TransactionsList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Signatures</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(tx => (
            <TableRow key={tx.id}>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell className="font-mono">{tx.to}</TableCell>
              <TableCell>
                <Badge
                  variant={tx.status === "Executed" ? "default" : tx.status === "Pending" ? "secondary" : "destructive"}
                >
                  {tx.status}
                </Badge>
              </TableCell>
              <TableCell>
                {tx.signatures}/{tx.required}
              </TableCell>
              <TableCell>
                {tx.status === "Pending" && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Sign
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
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
