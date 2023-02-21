// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract WithdrawVoting is BaseVoting {
    address public recipient;
    uint256 public amount;

    function initialize(address payable _daoContract, address _recipient, uint256 _amount) external initializer {
        baseVotingInitialize(_daoContract);
        require(_amount > 0, "WithdrawVoting: amount = 0");
        recipient = _recipient;
        amount = _amount;
    }

    function execute() internal override {
        daoContract.addNewWithdrawRequest(recipient, amount);
        daoContract.withdrawFromQueue();
    }
}
