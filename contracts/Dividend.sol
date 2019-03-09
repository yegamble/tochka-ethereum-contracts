pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import 'zeppelin-solidity/contracts/payment/PullPayment.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Dividend is StandardToken, MintableToken, PullPayment {
  using SafeMath for uint256;

  mapping(uint256 => uint256) public paidIn;
  uint256 public currentPeriod;
  mapping (address => mapping (uint256 => uint256)) periodWithdrawn;
  mapping(uint256 => uint256) public excludeFromTotal; // To keep new tokens from diluting
                                                       // dividends in current period

  event DividendPayment(address indexed recipient, uint256 weiPayment);

  function Dividend() public {
    currentPeriod = 0;
  }

  /**
  * @dev Charge a period's dividend
  * @param _period The period of the balance submitted.
  */
  function payDividend  (uint256 _period) public payable onlyOwner {
    paidIn[_period] = msg.value;
    currentPeriod = _period;
  }

  /**
  * @dev Show a period's dividend
  * @param _period The period of the balance to show.
  */
  function showDividend (uint256 _period) public constant returns (uint256) {
    return paidIn[_period];
  }
  /**
  * @dev Check how much a dividend payment for the period would be.
  */
  function checkDividend () public constant returns(uint256) {
    if (msg.sender == owner) {
      return 0;
    }
    uint256 senderBalance = balances[msg.sender];
    uint256 periodDividiend = paidIn[currentPeriod];
    uint256 portion = periodDividiend.mul(senderBalance).div(totalSupply_.sub(balances[owner]).sub(excludeFromTotal[currentPeriod]));
    if (periodWithdrawn[msg.sender][currentPeriod] >= portion){
      return 0;
    }
    uint256 withdrawn = portion.sub(periodWithdrawn[msg.sender][currentPeriod]);
    return withdrawn;
  }

  /**
  * @dev Withdraw the dividend.
  *
  * Note that after this call one still needs to withdrawPayments (from PullPayment)
  */
  function withdrawDividend () public {
    require(msg.sender != owner);
    uint256 withdrawn = checkDividend();
    require(withdrawn > 0);
    periodWithdrawn[msg.sender][currentPeriod] = periodWithdrawn[msg.sender][currentPeriod].add(withdrawn);
    asyncSend(msg.sender, withdrawn);
    DividendPayment(msg.sender, withdrawn);
  }

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  *
  * Note that this is an override of the version that is found in BasicToken. This
  * version makes sure that one can't withdraw the last dividend from transferred tokens.
  * As with an equity, one can collect the *next* payment, not the previous.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));

    if (msg.sender == owner) {
      excludeFromTotal[currentPeriod] = excludeFromTotal[currentPeriod].add(_value);
    }

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    
    // The new code:
    uint256 periodDividiend = paidIn[currentPeriod];
    uint256 portion;
    if (balances[owner] + excludeFromTotal[currentPeriod] >= totalSupply_){
      portion = 0;
    } else {
      portion = periodDividiend.mul(_value).div(totalSupply_.sub(balances[owner]).sub(excludeFromTotal[currentPeriod]));
    }
    periodWithdrawn[_to][currentPeriod] = periodWithdrawn[_to][currentPeriod].add(portion);

    Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   *
   * Again, this is an override of the transferFrom function (in this case
   * in StandardToken) to ensure that the transferred tokens don't affect
   * divided payments
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));

    if (_from == owner) {
      excludeFromTotal[currentPeriod] = excludeFromTotal[currentPeriod].add(_value);
    }

    uint256 _allowance = allowed[_from][msg.sender];

    // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
    // require (_value <= _allowance);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = _allowance.sub(_value);

    // New code
    uint256 periodDividiend = paidIn[currentPeriod];
    uint256 portion;
    if (balances[owner] + excludeFromTotal[currentPeriod] >= totalSupply_){
      portion = 0;
    } else {
      portion = periodDividiend.mul(_value).div(totalSupply_.sub(balances[owner]).sub(excludeFromTotal[currentPeriod]));
    }
    periodWithdrawn[_to][currentPeriod] = periodWithdrawn[_to][currentPeriod].add(portion);


    Transfer(_from, _to, _value);
    return true;
  }


}
