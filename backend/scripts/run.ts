import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  await waveContract.deployed();
  console.log(owner.address, "deployed contract to:", waveContract.address);
}

(async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
