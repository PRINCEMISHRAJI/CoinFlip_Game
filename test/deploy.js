import { expect }  from 'chai';

describe("CoinFlip Contract", function () {
    it("Should deploy the contract and set the owner", async function () {
        const [owner] = await ethers.getSigners();

        const CoinFlip = await ethers.getContractFactory("CoinFlip");
        const coinFlip = await CoinFlip.deploy();
        await coinFlip.deployed();

        expect(await coinFlip.owner()).to.equal(owner.address);
    });
});
