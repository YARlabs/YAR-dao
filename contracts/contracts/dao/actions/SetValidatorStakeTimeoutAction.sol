// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetValidatorStakeTimeoutAction is IDaoClosureState {
    uint256 public validatorStakeTimeout;
    
    event NewValidatorStakeTimeout(uint256 newValue, uint256 prevValue);

    function setValidatorStakeTimeout(uint256 _newValidatorStakeTimeout) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewValidatorStakeTimeout({
            newValue: _newValidatorStakeTimeout,
            prevValue: validatorStakeTimeout
        });
        validatorStakeTimeout = _newValidatorStakeTimeout;
    }
}
