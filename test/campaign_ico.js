const BigNumber = web3.BigNumber;
const mock = require('./mocks');

const TochkaICO   = artifacts.require('TochkaICO.sol');
const TochkaShare = artifacts.require('TochkaShare.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();


contract('TochkaICO', function ([fundWallet, tokenWallet, investor, otherInvestor]) {
  const RATE = new BigNumber(1000);
  const CAP = mock.ether(20);
  const ALLOWANCE = new BigNumber(1e8);
  const TOTAL_SUPPLY = new BigNumber(1e9);

  before(async function () {
    this.startTime    = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    this.endTime      = this.startTime + mock.duration.weeks(1);
    this.afterEndTime = this.endTime + mock.duration.seconds(1);

    this.token     = await TochkaShare.new();
    this.crowdsale = await TochkaICO.new(
        this.startTime, 
        this.endTime, 
        RATE, 
        fundWallet, 
        tokenWallet, 
        CAP, 
        this.token.address
    );
    this.token.mint(tokenWallet, TOTAL_SUPPLY);
    this.token.approve(this.crowdsale.address, ALLOWANCE, {from: tokenWallet});
  });

  it('should create crowdsale with correct parameters', async function () {
    this.crowdsale.should.exist;
    this.token.should.exist;

    const startTime = await this.crowdsale.openingTime();
    const endTime = await this.crowdsale.closingTime();
    const rate = await this.crowdsale.rate();
    const fundWalletAddress = await this.crowdsale.wallet();
    const cap = await this.crowdsale.cap();
    const tokenWalletAddress = await this.crowdsale.tokenWallet();
    const tokenWalletBalance = await this.token.balanceOf(tokenWalletAddress);
    const allowanceToCrowdsale = await this.token.allowance(tokenWalletAddress, this.crowdsale.address);
    const totalSupply = await this.token.totalSupply();

    startTime.should.be.bignumber.equal(this.startTime);
    endTime.should.be.bignumber.equal(this.endTime);
    rate.should.be.bignumber.equal(RATE);
    fundWalletAddress.should.be.equal(fundWallet);
    tokenWalletAddress.should.be.equal(tokenWallet);
    cap.should.be.bignumber.equal(CAP);
    allowanceToCrowdsale.should.be.bignumber.equal(ALLOWANCE);
    totalSupply.should.be.bignumber.equal(TOTAL_SUPPLY);
    tokenWalletBalance.should.be.bignumber.equal(TOTAL_SUPPLY);
  });

  it('should not accept payments before start', async function () {
    await this.crowdsale.send(mock.ether(0.1)).should.be.rejectedWith('revert');
    await this.crowdsale.buyTokens(investor, { from: investor, value: mock.ether(0.1) }).should.be.rejectedWith('revert');
  });

  // it('should accept payments during the sale', async function () {
  //   const investmentAmount = mock.ether(0.1);
  //   const expectedTokenAmount = RATE.mul(investmentAmount);

  //   await mock.increaseTimeTo(this.startTime);
  //   await this.crowdsale.buyTokens(investor, { value: investmentAmount, from: investor }).should.be.fulfilled;

  //   (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
  //   (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
  // });

  // it('should reject payments after end', async function () {
  //   await mock.increaseTimeTo(this.afterEndTime);
  //   await this.crowdsale.send(mock.ether(0.1)).should.be.rejectedWith('revert');
  //   await this.crowdsale.buyTokens(investor, { value: mock.ether(0.1), from: investor }).should.be.rejectedWith('revert');
  // });

  it('should reject payments over cap', async function () {
    // await mock.increaseTimeTo(this.startTime);
    await this.crowdsale.send(CAP);
    await this.crowdsale.send(0.1).should.be.rejectedWith('revert');
  });

});