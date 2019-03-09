pragma solidity ^0.4.18;

contract TochkaEscrowPayment {

    function multitransfer(address[] _contributors, uint256[] _percents) external payable {
        uint amount = msg.value;
        require(amount > 0);
        require(_percents.length <= _contributors.length);
        uint256 i = 0;
        uint256 amountToSend = 0;
        for (i; i < _contributors.length; i++) {
            require(_percents[i] <= 100);
            require(_percents[i] >= 0);
            amountToSend = amount * _percents[i] / 100;
            if (amountToSend > 0) {
                _contributors[i].transfer(amountToSend);
            }
        }
        
    }
}