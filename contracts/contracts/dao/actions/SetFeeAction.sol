// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetFeeAction is IDaoClosureState {
    uint256 public fee;
    
    event NewFees(uint256 newValue, uint256 prevValue);

    function setFee(uint256 _newFee) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewFees({ newValue: _newFee, prevValue: fee });
        fee = _newFee;
    }
}
