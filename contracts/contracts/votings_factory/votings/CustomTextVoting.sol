// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract CustomTextVoting is BaseVoting {
    bytes32 public textHash;
    uint256 public amount;

    function initialize(address payable _daoContract, bytes32 _textHash) external initializer {
        baseVotingInitialize(_daoContract);
        textHash = _textHash;
    }

    function execute() internal override {
        daoContract.acceptText(textHash);
    }
}
