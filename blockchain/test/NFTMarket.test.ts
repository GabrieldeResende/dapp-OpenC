import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("NFT Market", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
        const nftMarket = await NFTMarket.deploy();
        const marketAddress = await nftMarket.getAddress();

        const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
        const nftCollection = await NFTCollection.deploy(marketAddress);

        return { nftMarket, nftCollection, owner, otherAccount };
    }

    it("Should fetch items", async function () {
        const { nftMarket, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

        const listingPrice = (await nftMarket.listingPrice()).toString()
        const auctionPrice = ethers.parseUnits("1", "ether")

        await nftCollection.mint("metadata uri")
        await nftMarket.createMarketItem(nftCollection, 1, auctionPrice, { value: listingPrice })

        const marketItems = await nftMarket.fetchMarketItems()

        expect(marketItems.length).to.equal(1);
    });

    it("Should fetch my items", async function () {
        const { nftMarket, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

        const listingPrice = (await nftMarket.listingPrice()).toString()
        const auctionPrice = ethers.parseUnits("1", "ether")

        await nftCollection.mint("metadata uri")
        await nftCollection.mint("metadata uri2")

        await nftMarket.createMarketItem(nftCollection, 1, auctionPrice, { value: listingPrice })
        await nftMarket.createMarketItem(nftCollection, 2, auctionPrice, { value: listingPrice })

        const instance = nftMarket.connect(otherAccount)
        await instance.createMarketSale(nftCollection, 2, {value: auctionPrice})

        const myNFTs = await instance.fetchMyNFTs()

        expect(myNFTs.length).to.equal(1);
        expect(myNFTs[0].itemId).to.equal(2);
    });

    it("Should fetch my created items", async function () {
        const { nftMarket, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

        const listingPrice = (await nftMarket.listingPrice()).toString()
        const auctionPrice = ethers.parseUnits("1", "ether")

        await nftCollection.mint("metadata uri")
        await nftCollection.mint("metadata uri2")

        await nftMarket.createMarketItem(nftCollection, 1, auctionPrice, { value: listingPrice })
        await nftMarket.createMarketItem(nftCollection, 2, auctionPrice, { value: listingPrice })

        const createdItens = await nftMarket.fetchItemsCreated()

        expect(createdItens.length).to.equal(2);
    });

    it("Should create and execute market sale", async function () {
        const { nftMarket, nftCollection, owner, otherAccount } = await loadFixture(deployFixture);

        const listingPrice = (await nftMarket.listingPrice()).toString()
        const auctionPrice = ethers.parseUnits("1", "ether")

        await nftCollection.mint("metadata uri")
        await nftMarket.createMarketItem(nftCollection, 1, auctionPrice, { value: listingPrice })

        const instance = nftMarket.connect(otherAccount)
        await instance.createMarketSale(nftCollection, 1, {value: auctionPrice})

        const nftOwner = await nftCollection.ownerOf(1)
        const marketItems = await nftMarket.fetchMarketItems()

        expect(nftOwner).to.equal(otherAccount.address);
        expect(marketItems.length).to.equal(0);
    });
});
