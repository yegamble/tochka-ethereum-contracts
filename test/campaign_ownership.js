const mock = require('./mocks');

contract('Owned Tochka Share Campaign', accounts => {

    let campaign;
    before(async () => {
         campaign = await mock.campaign();
    });
    
    it("should have the correct owner", async () => {
        let owner = await campaign.owner.call();
        assert(owner == accounts[0], "Campaign was not created with correct owner");
    });
    
    it("should allow the ownership to be transferred", async () => {
        await campaign.transferOwnership(accounts[2], {from: accounts[0], value:0});
        let owner = await campaign.owner.call();
        assert(owner == accounts[2], "Campaign ownership was not transferred");
    });
    
    it("should fail when non-owner attempts ownership transfer", async () => {
        await mock.expectRevert(async () => {
            await campaign.transferOwnership(accounts[0], {from: accounts[0], value:0});
        });
    });

});
