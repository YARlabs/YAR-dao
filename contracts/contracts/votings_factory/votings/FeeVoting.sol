// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract FeeVoting is BaseVoting {
    uint256 public newFee;

    function initialize(address payable _daoContract, uint256 _newFee) external initializer {
        baseVotingInitialize(_daoContract);
        newFee = _newFee;
    }

    function execute() internal override {
        daoContract.setFee(newFee);
    }
}
