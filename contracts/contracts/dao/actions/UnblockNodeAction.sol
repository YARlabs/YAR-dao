// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract UnblockNodeAction is IDaoClosureState {
    mapping(bytes32 => bool) public blockedNodes;
    
    event NodeUnblocked(bytes32 nodeHash);

    function unblockNode(bytes32 _nodeHash) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        delete blockedNodes[_nodeHash];
        emit NodeUnblocked({
            nodeHash: _nodeHash
        });
    }
}
