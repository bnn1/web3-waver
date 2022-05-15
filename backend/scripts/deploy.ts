import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  let accountBalance = await deployer.getBalance();

  console.log(
    "Account balance: %s ETH",
    ethers.utils.formatEther(accountBalance.toString())
  );

  console.log(deployer.address, "is now deploying a contract...");
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: ethers.utils.parseEther("0.025"),
  });

  await waveContract.deployed();
  accountBalance = await deployer.getBalance();
  console.log("Deployed to:", waveContract.address);
  console.log(
    "Account balance: %s ETH",
    ethers.utils.formatEther(accountBalance.toString())
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
