// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { BaseVoting } from "./BaseVoting.sol";
import { ConstantsLibrary } from "../../libraries/ConstantsLibrary.sol";

contract PercentageOfVotesToConfirmVoting is BaseVoting {
    uint256 public newPercentageOfVotesToConfirm;

    function initialize(address payable _daoContract, uint256 _newPercentageOfVotesToConfirm) external initializer {
        baseVotingInitialize(_daoContract);
        require(_newPercentageOfVotesToConfirm <= ConstantsLibrary.MAX_PERCENTAGE, "FeesVoting: new fees > 100%");
        newPercentageOfVotesToConfirm = _newPercentageOfVotesToConfirm;
    }

    function execute() internal override {
        daoContract.setPercentageOfVotesToConfirm(newPercentageOfVotesToConfirm);
    }
}
