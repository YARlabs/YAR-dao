// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract UnblockNodeVoting is BaseVoting {
    bytes32 public nodeHash;

    function initialize(address payable _daoContract, bytes32 _nodeHash) external initializer {
        baseVotingInitialize(_daoContract);
        nodeHash = _nodeHash;
    }

    function execute() internal override {
        daoContract.unblockNode(nodeHash);
    }
}
