// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";

contract CertifiedConnectorVoting is BaseVoting {
    bytes32 public connectorHash;
    bool public value;

    function initialize(address payable _daoContract, bytes32 _connectorHash, bool _value) external initializer {
        baseVotingInitialize(_daoContract);
        connectorHash = _connectorHash;
        value = _value;
    }

    function execute() internal override {
        daoContract.setCertifiedConnector(connectorHash, value);
    }
}
