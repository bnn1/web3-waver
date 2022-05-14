import { ethers } from "ethers";
import wavePortalAbi from "./ABI/WavePortal.json";

export { wavePortalContract };

const wavePortalContractCreator = async () => {
  try {
    if (typeof window === "undefined") return;
    const { ethereum } = window;
    console.log("ONE", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      throw new Error("Specify NEXT_PUBLIC_CONTRACT_ADDRESS in .env");
    }

    const provider = new ethers.providers.Web3Provider(
      ethereum as unknown as ethers.providers.ExternalProvider
    );
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      wavePortalAbi.abi,
      signer
    );

    console.log("CONTRACT:", contract);
    return contract;
  } catch (error) {
    console.error(error);
  }
};

const wavePortalContract = await wavePortalContractCreator();
console.log("WAVE CONTRACT:", wavePortalContract);
