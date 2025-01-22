"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useMultiSigWallet } from "~~/hooks/useMultiSigWallet";
import { notification } from "~~/utils/scaffold-eth";

type TransactionType = "transfer" | "addOwner" | "removeOwner" | "changeRequirement";

interface TransactionData {
  to: string;
  value: string;
  data: `0x${string}`;
}

export function CreateTransaction() {
  const { submitNewTransaction } = useMultiSigWallet();
  const { data: contractInfo } = useDeployedContractInfo("MultiSigWallet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txType, setTxType] = useState<TransactionType>("transfer");
  const [formData, setFormData] = useState<TransactionData>({
    to: "",
    value: "0",
    data: "0x" as `0x${string}`,
  });

  const generateTransactionData = (type: TransactionType, params: any = {}): TransactionData => {
    if (!contractInfo?.address) return { to: "", value: "0", data: "0x" as `0x${string}` };

    const iface = new ethers.Interface(contractInfo.abi);
    const to = params.to || "";
    const value = params.value || "0";

    switch (type) {
      case "transfer":
        return {
          to,
          value,
          data: "0x" as `0x${string}`,
        };
      case "addOwner":
        return {
          to: contractInfo.address,
          value: "0",
          data: iface.encodeFunctionData("addOwner", [to || ethers.ZeroAddress]) as `0x${string}`,
        };
      case "removeOwner":
        return {
          to: contractInfo.address,
          value: "0",
          data: iface.encodeFunctionData("removeOwner", [to || ethers.ZeroAddress]) as `0x${string}`,
        };
      case "changeRequirement":
        return {
          to: contractInfo.address,
          value: "0",
          data: iface.encodeFunctionData("changeRequirement", [Number(value) || 1]) as `0x${string}`,
        };
      default:
        return { to: "", value: "0", data: "0x" as `0x${string}` };
    }
  };

  useEffect(() => {
    if (contractInfo?.address) {
      setFormData(prevData => ({
        ...prevData,
        to: txType === "transfer" ? prevData.to : contractInfo.address,
      }));
    }
  }, [contractInfo?.address, txType]);

  const handleTypeChange = (type: TransactionType) => {
    setTxType(type);
    setFormData(generateTransactionData(type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const valueInWei = ethers.parseEther(formData.value || "0");
      await submitNewTransaction(formData.to, valueInWei, formData.data);
      notification.success("Transaction submitted successfully!");
      setFormData({ to: "", value: "0", data: "0x" as `0x${string}` });
      setTxType("transfer");
    } catch (error: any) {
      console.error("Failed to submit transaction:", error);
      notification.error(error.message || "Failed to submit transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Transaction Type</Label>
        <Select value={txType} onValueChange={(value: TransactionType) => handleTypeChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transfer">Transfer ETH</SelectItem>
            <SelectItem value="addOwner">Add Owner</SelectItem>
            <SelectItem value="removeOwner">Remove Owner</SelectItem>
            <SelectItem value="changeRequirement">Change Required Signatures</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="to">
          {txType === "transfer"
            ? "Destination Address"
            : txType === "changeRequirement"
              ? "Required Signatures"
              : "Owner Address"}
        </Label>
        <Input
          id="to"
          value={formData.to}
          onChange={e => {
            const newData = generateTransactionData(txType, { to: e.target.value });
            setFormData(newData);
          }}
          placeholder={txType === "changeRequirement" ? "Number of required signatures" : "0x..."}
          type={txType === "changeRequirement" ? "number" : "text"}
          required
        />
      </div>

      {txType === "transfer" && (
        <div>
          <Label htmlFor="value">Value (ETH)</Label>
          <Input
            id="value"
            type="number"
            step="any"
            value={formData.value}
            onChange={e => setFormData({ ...formData, value: e.target.value })}
            placeholder="0.0"
            required
          />
        </div>
      )}

      {txType !== "transfer" && (
        <div>
          <Label htmlFor="data">Transaction Data (Generated)</Label>
          <Input id="data" value={formData.data} readOnly className="font-mono text-sm bg-muted" />
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Transaction"}
      </Button>
    </form>
  );
}
