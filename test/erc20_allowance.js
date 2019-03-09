const mock = require('./mocks');

contract('ERC20Allowances Contract', accounts => {

    let campaign;
    let initial = 100;
    before(async () => {
         campaign = await mock.campaign({initialize: initial});
    });

    it("should allow a third party-authorization", async () => {
        await campaign.approve(accounts[1], 10, {from: accounts[0]})
        let allowance = await campaign.allowance.call(accounts[0], accounts[1]);
        assert.equal(allowance.valueOf(), 10, "Looks like someone is grounded with no allowance");
    });

    it("should allow a for approvals to be increased", async () => {
        await campaign.approve(accounts[1], 10, {from: accounts[0]})
        await campaign.increaseApproval(accounts[1], 10, {from: accounts[0]})
        let allowance = await campaign.allowance.call(accounts[0], accounts[1]);
        assert.equal(allowance.valueOf(), 20, "Looks like someone is grounded with no allowance");
    });

    it("should allow fa for approvals to be decreased", async () => {
        await campaign.mint(accounts[1], 100, {from: accounts[0]});
        await campaign.approve(accounts[2], 10, {from: accounts[1]})
        await campaign.decreaseApproval(accounts[2], 5, {from: accounts[1]})
        let allowance = await campaign.allowance.call(accounts[1], accounts[2]);
        assert.equal(allowance.valueOf(), 5, "Looks like someone is grounded with no allowance");
    });

    it("should allow authorized third-party transfers to take place", async () => {
        await campaign.transferFrom(accounts[0], accounts[3], 10, {from: accounts[1]});
        let balance = await campaign.balanceOf.call(accounts[3]);
        assert.equal(balance.valueOf(), 10, "Account did not receive the third party transfer");
    });

    it("should allow not allow transferring more tokens than allowed", async () => {
        await campaign.approve(accounts[1], 10, {from: accounts[0]})
        await mock.expectInvalidOperation(async () => {
            await campaign.transferFrom(accounts[0], accounts[3], 20, {from: accounts[1]});
        });
    });

    it("should allow not allow non-approved third-part transfers", async () => {
        await campaign.approve(accounts[1], 10, {from: accounts[0]});
        await mock.expectInvalidOperation(async () => {
            await campaign.transferFrom(accounts[2], accounts[3], 20, {from: accounts[1]});
        });
    });

    it("should not allow third-party transfers of more than an account has", async () => {
        await campaign.approve(accounts[1], 100, {from: accounts[0]}); //don't have than many any more
        let allowance = await campaign.allowance.call(accounts[0], accounts[1]);
        assert.equal(allowance.valueOf(), 100, "Allowance is too big, but should show anyway");
        await mock.expectInvalidOperation(async () => {
            await campaign.transferFrom(accounts[0], accounts[3], 100, {from: accounts[1]});
        });
    });

});
