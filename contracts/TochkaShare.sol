pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

import "./Dividend.sol";


contract TochkaShare is MintableToken, Dividend {
    using SafeMath for uint256;

    /** public data from our other classes:
    *   address public owner;           // from Ownable
    *   uint256 public totalSupply_;    // from ERC20Basic
    */

    // Expected of ERC20
    string public constant name     = "TochkaShare0";
    string public constant symbol   = "TKS";
    uint8  public constant decimals = 18;

}

