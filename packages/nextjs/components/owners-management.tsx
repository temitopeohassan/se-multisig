{`'use client';

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield } from "lucide-react";

const owners = [
  {
    address: "0x1234...5678",
    addedDate: "2024-03-20",
    status: "Active",
    isAdmin: true,
  },
  {
    address: "0x8765...4321",
    addedDate: "2024-03-20",
    status: "Active",
    isAdmin: false,
  },
  {
    address: "0x9876...1234",
    addedDate: "2024-03-20",
    status: "Active",
    isAdmin: false,
  },
];

export function OwnersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Wallet Owners</h2>
          <p className="text-sm text-muted-foreground">
            Manage the owners of this multisig wallet
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Owner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.map((owner) => (
            <TableRow key={owner.address}>
              <TableCell className="font-mono">{owner.address}</TableCell>
              <TableCell>{owner.addedDate}</TableCell>
              <TableCell>
                <Badge variant="secondary">{owner.status}</Badge>
              </TableCell>
              <TableCell>
                {owner.isAdmin && (
                  <Badge className="bg-primary">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="text-destructive">
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`}