// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract VotingTimeoutVoting is BaseVoting {
    uint256 public newVotingTimeout;

    function initialize(address payable _daoContract, uint256 _newVotingTimeout) external initializer {
        baseVotingInitialize(_daoContract);
        newVotingTimeout = _newVotingTimeout;
    }

    function execute() internal override {
        daoContract.setVotingTimeout(newVotingTimeout);
    }
}
