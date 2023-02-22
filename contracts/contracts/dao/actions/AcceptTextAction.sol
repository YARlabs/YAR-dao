// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract AcceptTextAction is IDaoClosureState {
    mapping(bytes32 => bool) public acceptedTexts;

    event NewAcceptedText(bytes32 textHash);

    function acceptText(bytes32 _textHash) external {
        votingsFactory.enforceIsVotingContract(msg.sender);

        acceptedTexts[_textHash] = true;
        emit NewAcceptedText({ textHash: _textHash });
    }
}
