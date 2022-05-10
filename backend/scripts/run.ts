import { ethers } from "hardhat";

async function main() {
  const [owner, randomPerson] = await ethers.getSigners();
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  await waveContract.deployed();
  console.log(owner.address, "deployed contract to:", waveContract.address);

  let txn = await waveContract.wave();
  await txn.wait();

  txn = await waveContract.connect(randomPerson).wave();
  await txn.wait();

  const wavers = await waveContract.getWavers();

  console.log("Wavers:::", wavers);
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
