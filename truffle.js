var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = require("./mnemonic.js");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    mainet: {
      provider: function() {
        return new HDWalletProvider(mnemonic.mnemonic, mnemonic.url, 1);
      },
      network_id: 1,
      gas: 4698712,
      gasPrice: 8e9
    } 
  }
};
