const mock = require('./mocks');

contract('Utility contract for Tochka Operations', accounts => {
  
  let tochkaEscrowPayment;
  before(async () => {
       tochkaEscrowPayment = await mock.escrowPayment();
  });

  it("should transfer payments according to percents provided ", async () => {
      let value = 10;
      value = web3.toWei(value);
      await tochkaEscrowPayment.multitransfer([accounts[6], accounts[7]], [30, 70], {from: accounts[5], value: value});
  });

});
