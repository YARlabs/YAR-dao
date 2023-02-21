// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract ValidatorStakeTimeoutVoting is BaseVoting {
    uint256 public newValidatorStakeTimeout;

    function initialize(address payable _daoContract, uint256 _newValidatorStakeTimeout) external initializer {
        baseVotingInitialize(_daoContract);
        newValidatorStakeTimeout = _newValidatorStakeTimeout;
    }

    function execute() internal override {
        daoContract.setValidatorStakeTimeout(newValidatorStakeTimeout);
    }
}
