const mock = require('./mocks');

contract('ERC20Basic Contract', accounts => {

    let campaign;
    let initial = 100;
    before(async () => {
         campaign = await mock.campaign({initialize: initial});
    });

    it("should expose the total supply, vis a vis the ERC20 standard", async () => {
        let totalSupply = await campaign.totalSupply.call();
        assert.equal(totalSupply.valueOf(), initial, "Conversion of moolah broken in this reality");
    });

    it("should instantiate with the correct owner having some tokens", async () => {
        let balance = await campaign.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), initial, "Owner does not have correct number of tokens");
    });

    it("should allow tokens to be transferred", async () => {
        await campaign.transfer(accounts[1], 50);
        let balance = await campaign.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), 50, "Owner does not have correct number of tokens");
        let balance2 = await campaign.balanceOf.call(accounts[1]);
        assert.equal(balance2.valueOf(), 50, "Trasferee does not have correct number of tokens");
    });

    it("should not allow more tokens to be transferred than are had", async () => {
        await mock.expectInvalidOperation(async () => {
            await campaign.transfer(accounts[1], 51, {from: accounts[0]});
        });
    });

    it("should return coins if the transfer failed", async () => {
        let balance3 = await campaign.balanceOf.call(accounts[0]);
        let balance4 = await campaign.balanceOf.call(accounts[1]);
        assert.equal(balance3.valueOf(), 50, "Owner didn't get coins back");
        assert.equal(balance4.valueOf(), 50, "Transferee got a TANSTAFL");
    });

    it("should not allow non-owners to increase the total supply", async () => {
        await mock.expectRevert(async () => {
            await campaign.mint(accounts[0], 100, {from: accounts[1]});
        });
    });

});
