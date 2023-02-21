// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract ValidatorStakeAmountVoting is BaseVoting {
    uint256 public newValidatorStakeAmount;

    function initialize(address payable _daoContract, uint256 _newValidatorStakeAmount) external initializer {
        baseVotingInitialize(_daoContract);
        newValidatorStakeAmount = _newValidatorStakeAmount;
    }

    function execute() internal override {
        daoContract.setValidatorStakeAmount(newValidatorStakeAmount);
    }
}
