// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetPercentageOfVotesToConfirmAction is IDaoClosureState {
    uint256 public percentageOfVotesToConfirm;
    
    event NewPercentageOfVotesToConfirm(uint256 newValue, uint256 prevValue);

    function setPercentageOfVotesToConfirm(uint256 _newPercentageOfVotesToConfirm) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        emit NewPercentageOfVotesToConfirm({
            newValue: _newPercentageOfVotesToConfirm,
            prevValue: percentageOfVotesToConfirm
        });
        percentageOfVotesToConfirm = _newPercentageOfVotesToConfirm;
    }
}
