"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ethers } from "ethers";
import { useMultiSigWallet } from "~~/hooks/useMultiSigWallet";
import { notification } from "~~/utils/scaffold-eth";

export function OwnersManagement() {
  const { owners, requiredSignatures, submitNewTransaction, contractInfo } = useMultiSigWallet();
  const [newOwner, setNewOwner] = useState("");
  const [newRequiredSignatures, setNewRequiredSignatures] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractInfo?.address || !newOwner) return;

    setIsSubmitting(true);
    try {
      const iface = new ethers.Interface(contractInfo.abi);
      const data = iface.encodeFunctionData("addOwner", [newOwner]) as `0x${string}`;

      await submitNewTransaction(contractInfo.address, BigInt(0), data);

      notification.success("Add owner transaction submitted!");
      setNewOwner("");
    } catch (error: any) {
      console.error("Failed to add owner:", error);
      notification.error(error.message || "Failed to add owner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveOwner = async (ownerAddress: string) => {
    if (!contractInfo?.address) return;

    setIsSubmitting(true);
    try {
      const iface = new ethers.Interface(contractInfo.abi);
      const data = iface.encodeFunctionData("removeOwner", [ownerAddress]) as `0x${string}`;

      await submitNewTransaction(contractInfo.address, BigInt(0), data);

      notification.success("Remove owner transaction submitted!");
    } catch (error: any) {
      console.error("Failed to remove owner:", error);
      notification.error(error.message || "Failed to remove owner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRequiredSignatures = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractInfo?.address || !newRequiredSignatures) return;

    setIsSubmitting(true);
    try {
      const iface = new ethers.Interface(contractInfo.abi);
      const data = iface.encodeFunctionData("changeRequirement", [Number(newRequiredSignatures)]) as `0x${string}`;

      await submitNewTransaction(contractInfo.address, BigInt(0), data);

      notification.success("Change required signatures transaction submitted!");
      setNewRequiredSignatures("");
    } catch (error: any) {
      console.error("Failed to change required signatures:", error);
      notification.error(error.message || "Failed to change required signatures");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Current Owners</h2>
        <div className="space-y-2">
          {owners?.map((owner: string) => (
            <div key={owner} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
              <code className="text-sm">{owner}</code>
              <Button variant="destructive" size="sm" onClick={() => handleRemoveOwner(owner)} disabled={isSubmitting}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddOwner} className="space-y-4">
        <div>
          <Label htmlFor="newOwner">Add New Owner</Label>
          <Input
            id="newOwner"
            value={newOwner}
            onChange={e => setNewOwner(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Add Owner"}
        </Button>
      </form>

      <form onSubmit={handleChangeRequiredSignatures} className="space-y-4">
        <div>
          <Label htmlFor="requiredSignatures">
            Change Required Signatures (Current: {requiredSignatures?.toString()})
          </Label>
          <Input
            id="requiredSignatures"
            type="number"
            value={newRequiredSignatures}
            onChange={e => setNewRequiredSignatures(e.target.value)}
            placeholder="Number of required signatures"
            min="1"
            max={owners?.length || 1}
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Change Required Signatures"}
        </Button>
      </form>
    </div>
  );
}
