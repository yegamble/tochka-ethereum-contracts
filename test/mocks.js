const TochkaShare         = artifacts.require("./TochkaShare.sol");
const TochkaEscrowPayment = artifacts.require("./TochkaEscrowPayment.sol");

var accounts = web3.eth.accounts;

async function mockCampaign(options){
    var coin = await TochkaShare.new();
    options = options || {};
    // initialize will give a certain number of tokens to the owner, for testing.
    if (options['initialize']) coin.mint(accounts[0], options['initialize'], {from: accounts[0]});
    return coin
};

async function mockEscrowPayment(options){
    var coin = await TochkaEscrowPayment.new();
    return coin
};

async function expectInvalidOperation(operation){
    try {
        await operation();
        assert.fail('Expected error is not thrown');
    } catch(error) {
        assert.equal(
            error.toString(),
            "Error: VM Exception while processing transaction: invalid opcode",
            "Expected error is not thrown."
        )
    }
}

async function expectRevert(operation){
    try {
        await operation();
        assert.fail('Expected error is not thrown');
    } catch(error) {
        assert.equal(
            error.toString(),
            "Error: VM Exception while processing transaction: revert",
            "Expected error is not thrown."
        )
    }
}

duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}

// Increases testrpc time by the passed duration in seconds
function increaseTime (duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

function increaseTimeTo (target) {
  let now = latestTime();
  if (target < now) throw Error(`Cannot increase current time to a moment in the past()`);
  let diff = target - now;
  return increaseTime(diff);
}

function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}

module.exports = {
    campaign: mockCampaign,
    escrowPayment: mockEscrowPayment,
    duration: duration, 
    ether: ether,
    expectInvalidOperation: expectInvalidOperation,
    expectRevert: expectRevert,
    increaseTime: increaseTime,
    increaseTimeTo: increaseTimeTo,
    latestTime: latestTime
};
