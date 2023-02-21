// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract ValidatorBlockRewardsVoting is BaseVoting {
    uint256 public newValidatorBlockRewards;

    function initialize(address payable _daoContract, uint256 _newValidatorBlockRewards) external initializer {
        baseVotingInitialize(_daoContract);
        newValidatorBlockRewards = _newValidatorBlockRewards;
    }

    function execute() internal override {
        daoContract.setValidatorBlockRewards(newValidatorBlockRewards);
    }
}
