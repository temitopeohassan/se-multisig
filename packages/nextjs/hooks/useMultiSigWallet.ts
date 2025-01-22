import { useCallback, useEffect, useState } from "react";
import { useDeployedContractInfo, useScaffoldContract, useScaffoldWriteContract } from "./scaffold-eth";
import { useAccount } from "wagmi";

export const useMultiSigWallet = () => {
  const { address } = useAccount();
  const { data: contractInfo } = useDeployedContractInfo("MultiSigWallet");
  const { data: multiSigContract } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const { writeContractAsync: submitTransaction } = useScaffoldWriteContract("MultiSigWallet");
  const { writeContractAsync: confirmTransaction } = useScaffoldWriteContract("MultiSigWallet");
  const { writeContractAsync: revokeConfirmation } = useScaffoldWriteContract("MultiSigWallet");
  const { writeContractAsync: executeTransaction } = useScaffoldWriteContract("MultiSigWallet");

  const [owners, setOwners] = useState<string[]>([]);
  const [requiredSignatures, setRequiredSignatures] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);

  console.log("contractInfo", contractInfo);

  // Read functions
  const fetchOwners = useCallback(async () => {
    if (!multiSigContract) return [];
    const result = await multiSigContract.read.getOwners();
    return Array.from(result);
  }, [multiSigContract]);

  const fetchRequiredSignatures = useCallback(async () => {
    if (!multiSigContract) return 0;
    return await multiSigContract.read.requiredSignatures();
  }, [multiSigContract]);

  const fetchTransactionCount = useCallback(async () => {
    if (!multiSigContract) return 0;
    return await multiSigContract.read.getTransactionCount();
  }, [multiSigContract]);

  // Update state when contract is available
  useEffect(() => {
    const updateState = async () => {
      const [ownersData, signaturesData, countData] = await Promise.all([
        fetchOwners(),
        fetchRequiredSignatures(),
        fetchTransactionCount(),
      ]);
      setOwners(ownersData);
      setRequiredSignatures(Number(signaturesData));
      setTransactionCount(Number(countData));
    };

    if (multiSigContract) {
      updateState();
    }
  }, [multiSigContract, fetchOwners, fetchRequiredSignatures, fetchTransactionCount]);

  // Write functions
  const submitNewTransaction = useCallback(
    async (to: string, value: bigint, data: `0x${string}`) => {
      if (!submitTransaction) return;
      return await submitTransaction({
        functionName: "submitTransaction",
        args: [to, value, data],
      });
    },
    [submitTransaction],
  );

  const confirmTx = useCallback(
    async (txIndex: number) => {
      if (!confirmTransaction) return;
      return await confirmTransaction({
        functionName: "confirmTransaction",
        args: [BigInt(txIndex)],
      });
    },
    [confirmTransaction],
  );

  const revokeTxConfirmation = useCallback(
    async (txIndex: number) => {
      if (!revokeConfirmation) return;
      return await revokeConfirmation({
        functionName: "revokeConfirmation",
        args: [BigInt(txIndex)],
      });
    },
    [revokeConfirmation],
  );

  const executeTx = useCallback(
    async (txIndex: number) => {
      if (!executeTransaction) return;
      return await executeTransaction({
        functionName: "executeTransaction",
        args: [BigInt(txIndex)],
      });
    },
    [executeTransaction],
  );

  const getTransaction = useCallback(
    async (txIndex: number) => {
      if (!multiSigContract) return null;
      return await multiSigContract.read.transactions([BigInt(txIndex)]);
    },
    [multiSigContract],
  );

  // Add isOwner check
  const isOwner = useCallback(() => {
    if (!address || !owners) return false;
    return owners.includes(address);
  }, [address, owners]);

  return {
    owners,
    requiredSignatures,
    transactionCount,
    getTransaction,
    submitNewTransaction,
    confirmTx,
    revokeTxConfirmation,
    executeTx,
    address,
    contractInfo,
    isOwner,
  };
};
