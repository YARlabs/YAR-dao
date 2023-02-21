// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetValidatorBlockRewardsAction is IDaoClosureState {
    uint256 public validatorBlockRewards;

    event NewValidatorBlockRewards(uint256 newValue, uint256 prevValue);

    function setValidatorBlockRewards(uint256 _newValidatorBlockRewards) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewValidatorBlockRewards({
            newValue: _newValidatorBlockRewards,
            prevValue: validatorBlockRewards
        });
        validatorBlockRewards = _newValidatorBlockRewards;
    }
}
