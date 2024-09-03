import { ethers } from "hardhat";

async function main() {
    const NFTMarket = await ethers.getContractFactory("NFTMarket")
    const nftMarket = await NFTMarket.deploy()

    await nftMarket.waitForDeployment()

    console.log(`Contract deployed at ${nftMarket.target}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})