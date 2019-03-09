const mock = require('./mocks');

contract('Dividend-enabled Contract', accounts => {
  
  let campaign;
  let initial = 100;
  before(async () => {
       campaign = await mock.campaign({initialize: initial});
  });

  it("should allow a a dividend payment to be made", async () => {
      let period = 1;
      let value = 10;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});

      let currentPeriod = await campaign.currentPeriod.call();
      assert.equal(currentPeriod.valueOf(), period, "The current period should be set.");

      let paidIn = await campaign.showDividend(period);
      assert.equal(paidIn.valueOf(), value, "The period paid in should be correct");

  });

  it("should allow a a dividend payment to be withdrawn", async () => {
      // make is so that each account has 1/2, and thus has the ability to
      // withdraw 1/2, or 5

      let period = 2;
      let value = 10;
      value = web3.toWei(value);
      await campaign.transfer(accounts[1], 50, {from: accounts[0]});
      await campaign.transfer(accounts[2], 50, {from: accounts[0]});
      await campaign.payDividend(period, {from: accounts[0], value: value});
      await campaign.withdrawDividend({from: accounts[1]});

      let previous = web3.eth.getBalance(accounts[1]);
      await campaign.withdrawPayments({from: accounts[1]});
      let current = web3.eth.getBalance(accounts[1]);
      let delta = web3.fromWei((current - previous).valueOf());
      assert(delta < 5.1, "Amount withdrawn should not be too much");
      assert(delta > 4.9, "Amount withdrawn should not be too little");

      let bal = await campaign.checkDividend({from: accounts[1]});
      assert.equal(bal.valueOf(), 0, "There should be nothing left after withdraw.");
  });

  it("should now allow owner to withdraw dividend payment", async () => {
      // First give the owner some tokens.
      campaign.mint(accounts[0], 100);

      // Make a dividend payment
      let period = 3;
      let value = 10;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});
      // Try to remove (this should fail)
      await mock.expectRevert(async () => {
          await campaign.withdrawPayments({from: accounts[0]});
      });
  });
  it("should exclude holdings of the owner from dividend payment calculation", async () => {
      // Account 0 currently has 100, 1 has 50, and 2 has 50 TKS. The 100 should be
      // excluded, so that 1 and 2 can withdraw 1/2 of the balance paid.
      let bal0 = await campaign.checkDividend({from: accounts[0]});
      assert.equal(web3.fromWei(bal0.valueOf()), 0, "Account 0 should have no ether");
      let bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 5, "Account 1 should have 1/2 the ether");
      let bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 5, "Account 2 should have 1/2 the ether");
  });

  it("should not allow double dipping of dividend payments", async () => {
      // Account 0 will transfer all of its zydeco to accounts 3 and 4. 1 and 2
      // should be able to withdraw, but 3 and 4 shouldn't.

      let period = 4;
      let value = 10;
      value = web3.toWei(value);

      await campaign.payDividend(period, {from: accounts[0], value: value});
      await campaign.transfer(accounts[3], 50, {from: accounts[0]});
      await campaign.transfer(accounts[4], 50, {from: accounts[0]});

      let bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 5, "Account 1 should have 1/2 the ether");
      let bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 5, "Account 2 should have 1/2 the ether");
      let bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 0, "Account 3 should not have a dividend payment");
      let bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 0, "Account 4 should not have a dividend payment");
  });

  it("should correctly allow dividend withdraws of previous tokens after transfer", async () => {
      // This one is a little complicated. If I have some tokens that qualify for a dividend and
      // then get some more transferred, the amount of my payment should include the previous
      // tokens but exclude the transferred.

      let period = 5;
      let value = 1;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});
      let bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 0.25, "Account 1 should have 1/4 the ether");
      let bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 0.25, "Account 2 should have 1/4 the ether");
      let bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 0.25, "Account 3 should have 1/4 the ether");
      let bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 0.25, "Account 4 should have 1/4 the ether");

      // Now transfer some tokens to account 4. When it comes to the amount they qualify for, nothing
      // should change.

      campaign.mint(accounts[0], 100);
      await campaign.transfer(accounts[4], 50, {from: accounts[0]});
      bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 0.25, "Account 1 should have 1/4 the ether");
      bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 0.25, "Account 2 should have 1/4 the ether");
      bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 0.25, "Account 3 should have 1/4 the ether");
      bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 0.25, "Account 4 should have 1/4 the ether");
  });

  it("should not allow double dipping of dividend payments via third-party transfers", async () => {
      // Account 0 will transfer all of its zydeco to accounts 3 and 4. 1 and 2
      // should be able to withdraw, but 3 and 4 shouldn't.

      let period = 5;
      let value = 1;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});

      // First we're going to make sure that each of 1/4 still qualify with 1/4 of the ether. Note that Account 0
      // currently has 50 ether, so the following checks that the owner account is being
      // excluded from the calculation. Also note that at the end of the previous test we transferred 50 TKS
      // into account 4, but that shouldn't matter, as it was for a previous period.

      let bal0 = await campaign.checkDividend({from: accounts[0]});
      assert.equal(web3.fromWei(bal0.valueOf()), 0.0, "Owner should not qualify for dividends");
      let bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 0.25, "Account 1 should have 1/4 the ether");
      let bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 0.25, "Account 2 should have 1/4 the ether");
      let bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 0.25, "Account 3 should have 1/4 the ether");
      let bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 0.25, "Account 4 should have 1/4 the ether");

      // Now if we make a payment, account 4 should have twice as much ether.

      period = 6;
      value = 5;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});

      bal0 = await campaign.checkDividend({from: accounts[0]});
      assert.equal(web3.fromWei(bal0.valueOf()), 0.0, "Owner should not qualify for dividends in period 6");
      bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 1, "Account 1 should have 1/5 the ether in period 6");
      bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 1, "Account 2 should have 1/5 the ether in period 6");
      bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 1, "Account 3 should have 1/5 the ether in period 6");
      bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 2, "Account 4 should have 2/5 the ether in period 6");

      // We haven't actually tested transferFrom yet! Now we will transfer 50 ether into 1, 2, and 3.
      // At first, nothing should change.

      await campaign.mint(accounts[0], 150, {from: accounts[0]});
      await campaign.approve(accounts[4], 150, {from: accounts[0]});
      await campaign.transferFrom(accounts[0], accounts[1], 50, {from: accounts[4]});
      await campaign.transferFrom(accounts[0], accounts[2], 50, {from: accounts[4]});
      await campaign.transferFrom(accounts[0], accounts[3], 50, {from: accounts[4]});

      bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 1, "Account 1 should have 1/5 the ether in period 6 after transfer");
      bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 1, "Account 2 should have 1/5 the ether in period 6 after transfer");
      bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 1, "Account 3 should have 1/5 the ether in period 6 after transfer");
      bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 2, "Account 4 should have 2/5 the ether in period 6 after transfer");

      // After the next payment, they should have the same ether, because all accounts have 100 TKS.

      period = 7;
      value = 4;
      value = web3.toWei(value);
      await campaign.payDividend(period, {from: accounts[0], value: value});

      bal1 = await campaign.checkDividend({from: accounts[1]});
      assert.equal(web3.fromWei(bal1.valueOf()), 1, "Account 1 should have 1/4 the ether in period 7");
      bal2 = await campaign.checkDividend({from: accounts[2]});
      assert.equal(web3.fromWei(bal2.valueOf()), 1, "Account 2 should have 1/4 the ether in period 7");
      bal3 = await campaign.checkDividend({from: accounts[3]});
      assert.equal(web3.fromWei(bal3.valueOf()), 1, "Account 3 should have 1/4 the ether in period 7");
      bal4 = await campaign.checkDividend({from: accounts[4]});
      assert.equal(web3.fromWei(bal4.valueOf()), 1, "Account 4 should have 1/4 the ether in period 7");
  });
});
