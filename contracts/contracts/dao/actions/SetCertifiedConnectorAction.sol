// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract SetCertifiedConnectorAction is IDaoClosureState {
    mapping(bytes32 => bool) public certifiedConnectors;
    
    event SetCertifiedConnector(bytes32 connectorHash, bool value);

    function setCertifiedConnector(bytes32 _connectorHash, bool _value) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        certifiedConnectors[_connectorHash] = _value;
        emit SetCertifiedConnector({ connectorHash: _connectorHash, value: _value });
    }
}
