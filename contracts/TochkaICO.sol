pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

import './TochkaShare.sol';

contract TochkaICO is Crowdsale, CappedCrowdsale, FinalizableCrowdsale, AllowanceCrowdsale {

  function TochkaICO(
    uint256 _openingTime, // time when crowdsale starts
    uint256 _closingTime, // time when crowdsale ends
    uint256 _rate,        // eth per token
    address _fundWallet,  // wallet where ether is collected
    address _tokenWallet, // wallet that holds tokens 
    uint256 _cap,         // cap on crowdsale
    TochkaShare _token
    ) public payable
    Crowdsale(_rate, _fundWallet, _token)
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    TimedCrowdsale(_openingTime, _closingTime)
    AllowanceCrowdsale(_tokenWallet)
    {
    }
}