import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a MultiSigWallet contract with initial owners and required signatures
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMultiSigWallet: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // For testing purposes, we'll create an array of 3 initial owners including the deployer
  // In production, you would want to pass these addresses as environment variables or through a configuration file
  const initialOwners = [
    deployer, // deployer address
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // test address 1
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // test address 2
  ];

  // Initially require 2 signatures for any transaction
  const requiredSignatures = 2;

  await deploy("MultiSigWallet", {
    from: deployer,
    args: [initialOwners, requiredSignatures],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract
  const multiSigWallet = await hre.ethers.getContract<Contract>("MultiSigWallet", deployer);

  // Log initial setup
  const ownerCount = await multiSigWallet.getOwners();
  const requiredSigs = await multiSigWallet.requiredSignatures();
  console.log("📝 MultiSig deployed with:");
  console.log("👥 Initial owners:", ownerCount.length);
  console.log("✍️ Required signatures:", requiredSigs.toString());
};

export default deployMultiSigWallet;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags MultiSigWallet
deployMultiSigWallet.tags = ["MultiSigWallet"];
