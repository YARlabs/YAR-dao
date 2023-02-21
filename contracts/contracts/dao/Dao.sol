// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { VotingsFactory } from "../votings_factory/VotingsFactory.sol";
import { IDaoClosureState } from "./IDaoClosureState.sol";
import { ConstantsLibrary } from "../libraries/ConstantsLibrary.sol";
import { AcceptTextAction } from "./actions/AcceptTextAction.sol";
import { SetCertifiedConnectorAction } from "./actions/SetCertifiedConnectorAction.sol";
import { SetFeeAction } from "./actions/SetFeeAction.sol";
import { SetValidatorBlockRewardsAction } from "./actions/SetValidatorBlockRewardsAction.sol";
import { SetPercentageOfVotesToConfirmAction } from "./actions/SetPercentageOfVotesToConfirmAction.sol";
import { SetValidatorStakeAmountAction } from "./actions/SetValidatorStakeAmountAction.sol";
import { SetValidatorStakeTimeoutAction } from "./actions/SetValidatorStakeTimeoutAction.sol";
import { SetVotingTimeoutAction } from "./actions/SetVotingTimeoutAction.sol";
import { UnblockNodeAction } from "./actions/UnblockNodeAction.sol";
import { WithdrawAction } from "./actions/WithdrawAction.sol";
import { WithdrawERC20Action } from "./actions/WithdrawERC20Action.sol";

contract Dao is
    IDaoClosureState,
    AcceptTextAction,
    SetCertifiedConnectorAction,
    SetFeeAction,
    SetValidatorBlockRewardsAction,
    SetPercentageOfVotesToConfirmAction,
    SetValidatorStakeAmountAction,
    SetValidatorStakeTimeoutAction,
    SetVotingTimeoutAction,
    UnblockNodeAction,
    WithdrawAction,
    WithdrawERC20Action
{
    using SafeERC20 for IERC20;

    mapping(address => bool) public votingUsers;
    uint256 public votingUsersCount;

    constructor(
        address _votingsFactory,
        address[] memory _votingUsers,
        uint256 _fee,
        uint256 _percentageOfVotesToConfirm,
        uint256 _validatorBlockRewards,
        uint256 _validatorStakeAmount,
        uint256 _validatorStakeTimeout,
        uint256 _votingTimeout
    ) {
        uint256 l = _votingUsers.length;
        for (uint256 i; i < l; i++) {
            votingUsers[_votingUsers[i]] = true;
        }
        votingUsersCount = l;

        votingsFactory = VotingsFactory(_votingsFactory);
        votingsFactory.init(payable(address(this)));

        fee = _fee;
        percentageOfVotesToConfirm = _percentageOfVotesToConfirm;
        validatorBlockRewards = _validatorBlockRewards;
        validatorStakeAmount = _validatorStakeAmount;
        validatorStakeTimeout = _validatorStakeTimeout;
        votingTimeout = _votingTimeout;
    }

    function enforceIsVotingUser(address _user) public view {
        require(votingUsers[_user], "Dao: only voting user");
    }

    function enforceIsVotingNotExpired(uint256 _initTimestamp) public view {
        require(block.timestamp < _initTimestamp + votingTimeout, "Dao: voting expired!");
    }

    function isVotingAccepted(uint256 _acceptedAmount) external view returns (bool) {
        return
            (_acceptedAmount * ConstantsLibrary.MAX_PERCENTAGE) / votingUsersCount >=
            percentageOfVotesToConfirm;
    }

    function isVotingRejected(uint256 _rejectedAmount) external view returns (bool) {
        return
            (_rejectedAmount * ConstantsLibrary.MAX_PERCENTAGE) / votingUsersCount >=
            ConstantsLibrary.MAX_PERCENTAGE - percentageOfVotesToConfirm;
    }
}
