// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetValidatorStakeAmountAction is IDaoClosureState {
    uint256 public validatorStakeAmount;
    
    event NewValidatorStakeAmount(uint256 newValue, uint256 prevValue);

    function setValidatorStakeAmount(uint256 _newValidatorStakeAmount) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewValidatorStakeAmount({
            newValue: _newValidatorStakeAmount,
            prevValue: validatorStakeAmount
        });
        validatorStakeAmount = _newValidatorStakeAmount;
    }
}
