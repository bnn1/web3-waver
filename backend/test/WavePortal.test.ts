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
    await wavePortal.wave("Hey");

    expect(await wavePortal.getTotalWaves()).to.equal(1);
  });

  it("Should return valid amount of waves after each wave (2)", async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();
    await wavePortal.connect(owner).wave("Hey");
    expect(await wavePortal.getTotalWaves()).to.equal(1);
    await wavePortal.connect(randomPerson).wave("Hey");
    expect(await wavePortal.getTotalWaves()).to.equal(2);
  });

  it("Should emit an event containing new waver info", async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();

    await expect(wavePortal.wave("Hey"))
      .to.emit(wavePortal, "WaveEvent")
      .withArgs(owner.address, "Hey");
    await expect(wavePortal.connect(randomPerson).wave("yo"))
      .to.emit(wavePortal, "WaveEvent")
      .withArgs(randomPerson.address, "yo");
  });
  it("Should return array of Waver struct with waver's address", async () => {
    const [owner, randomPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy();

    await wavePortal.deployed();
    await wavePortal.connect(randomPerson).wave("Hello there");
    await wavePortal.wave("Hi!");

    const wavers = await wavePortal.getWavers();

    expect(wavers.length).to.be.equal(2);
    expect(wavers[0]).to.include(randomPerson.address);
    expect(wavers[1]).to.include(owner.address);
  });
  it("Should have a chance to pay the waver when contract balance is > 0.001 ether;", async () => {
    const signers = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();
    const contractBalance = Number(
      ethers.utils.formatEther(
        await ethers.provider.getBalance(wavePortal.address)
      )
    );
    for (let i = 0; i < signers.length; i += 1) {
      const tx = await wavePortal
        .connect(signers[i])
        .wave("Hello. I'm a signer number " + (i + 1));
      await tx.wait();
    }
    const contractBalanceAfter = Number(
      ethers.utils.formatEther(
        await ethers.provider.getBalance(wavePortal.address)
      )
    );
    expect(contractBalance).to.be.greaterThan(contractBalanceAfter);
  });
  it("Should fail if wave within 15mins after last wave", async () => {
    const [signer] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();
    const tx = await wavePortal.connect(signer).wave("Hello there");
    await tx.wait();

    await expect(
      wavePortal
        .connect(signer)
        .wave("Waving without waiting 15 minutes, hehehe")
    ).to.be.revertedWith("Wait 15m");
  });
  it("Should fail when non deployer widthdraws funds", async () => {
    const revertMsg = "Ownable: caller is not the owner";
    const [, randomPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();

    await expect(
      wavePortal.connect(randomPerson).withdraw()
    ).to.be.revertedWith(revertMsg);
  });
  it("Should withdraw funds from contract", async () => {
    const [owner] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();
    const contractBalanceBefore = ethers.utils.formatEther(
      await ethers.provider.getBalance(wavePortal.address)
    );
    const ownerBalanceBefore = ethers.utils.formatEther(
      await owner.getBalance()
    );
    await wavePortal.connect(owner).withdraw();

    const contractBalanceAfter = await ethers.provider.getBalance(
      wavePortal.address
    );
    const ownerBalanceAfter = Number(
      ethers.utils.formatEther(await owner.getBalance())
    );

    expect(contractBalanceAfter.toNumber()).to.be.equal(0);
    expect(ownerBalanceAfter).to.be.greaterThan(
      Number(ownerBalanceBefore) + Number(contractBalanceBefore) - 0.001
    );
  });
  it("Should transfer ownership and fail when old owner withdraws funds", async () => {
    const revertMsg = "Ownable: caller is not the owner";
    const [owner, anotherPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();

    await wavePortal.transferOwnership(anotherPerson.address);

    await expect(wavePortal.connect(owner).withdraw()).to.be.revertedWith(
      revertMsg
    );
  });
  it("Should transfer ownership and allow new owner to withdraw funds", async () => {
    const [owner, anotherPerson] = await ethers.getSigners();
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const wavePortal = await WavePortal.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
    await wavePortal.deployed();

    await wavePortal.connect(owner).transferOwnership(anotherPerson.address);

    const contractBalanceBefore = ethers.utils.formatEther(
      await ethers.provider.getBalance(wavePortal.address)
    );
    const ownerBalanceBefore = ethers.utils.formatEther(
      await anotherPerson.getBalance()
    );
    await wavePortal.connect(anotherPerson).withdraw();

    const contractBalanceAfter = await ethers.provider.getBalance(
      wavePortal.address
    );
    const ownerBalanceAfter = Number(
      ethers.utils.formatEther(await anotherPerson.getBalance())
    );

    expect(contractBalanceAfter.toNumber()).to.be.equal(0);
    expect(ownerBalanceAfter).to.be.greaterThan(
      Number(ownerBalanceBefore) + Number(contractBalanceBefore) - 0.001
    );
  });
});
