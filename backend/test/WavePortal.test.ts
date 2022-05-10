import { expect } from "chai";
import { ethers } from "hardhat";

describe("WavePortal", () => {
  it("Should return zero waves", async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();

    expect(await wavePortal.getTotalWaves()).to.equal(0);
  });

  it("Should return 1 wave", async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();
    await wavePortal.wave();

    expect(await wavePortal.getTotalWaves()).to.equal(1);
  });

  it("Should return valid amount of waves after each wave (2)", async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();
    await wavePortal.wave();
    expect(await wavePortal.getTotalWaves()).to.equal(1);
    await wavePortal.wave();
    expect(await wavePortal.getTotalWaves()).to.equal(2);
  });

  it("Should return an array of wavers (2)", async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();

    await wavePortal.wave();
    await wavePortal.connect(randomPerson).wave();

    const wavers = await wavePortal.getWavers();
    console.log("\n\n");
    console.log("USERS:", [owner.address, randomPerson.address]);
    console.log("\n\n");
    console.log("WAVERS:", wavers);
    expect(wavers).to.deep.equal([owner.address, randomPerson.address]);
  });
});

/**
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

 */
