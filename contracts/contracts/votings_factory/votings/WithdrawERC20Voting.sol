// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract WithdrawERC20Voting is BaseVoting {
    address public recipient;
    address public token;
    uint256 public amount;

    function initialize(address payable _daoContract, address _recipient, address _token, uint256 _amount) external initializer {
        baseVotingInitialize(_daoContract);
        require(_amount > 0, "WithdrawERC20Voting: amount = 0");
        recipient = _recipient;
        token = _token;
        amount = _amount;
    }

    function execute() internal override {
        address _token = token;
        daoContract.addNewWithdrawERC20Request(recipient, _token, amount);
        daoContract.withdrawERC20FromQueue(_token);
    }
}
