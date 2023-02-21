// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetVotingTimeoutAction is IDaoClosureState {
    uint256 public votingTimeout;
    
    event NewVotingTimeout(uint256 newValue, uint256 prevValue);
   
    function setVotingTimeout(uint256 _newVotingTimeout) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewVotingTimeout({ newValue: _newVotingTimeout, prevValue: votingTimeout });
        votingTimeout = _newVotingTimeout;
    }
}
