import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("NFT Collection", function () {
  async function deployFixture() {

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const nftMarket = await NFTMarket.deploy();
    const marketAddress = await nftMarket.getAddress();

    const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
    const nftCollection = await NFTCollection.deploy(marketAddress);

    return { marketAddress: nftMarket, nftCollection, owner, otherAccount };
  }

  it("Should mint token", async function () {
    const { marketAddress, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

    await nftCollection.mint("metadata uri")

    expect(await nftCollection.tokenURI(1)).to.equal("metadata uri");
  });

  it("Can change approval", async function () {
    const { marketAddress, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = nftCollection.connect(otherAccount)
    await instance.mint("metadata uri")
    await instance.setApprovalForAll(owner.address, false)

    expect(await nftCollection.isApprovedForAll(otherAccount.address, owner.address)).to.equal(false);
  });

  it("Can NOT change approval", async function () {
    const { marketAddress, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

    const instance = nftCollection.connect(otherAccount)
    await instance.mint("metadata uri")
     

     await expect(instance.setApprovalForAll(marketAddress, false)).to.be.revertedWith("Cannot remove marketplace approval")
  });

});
