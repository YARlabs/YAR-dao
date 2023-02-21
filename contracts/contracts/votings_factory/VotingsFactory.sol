// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { WithdrawVoting } from "./votings/WithdrawVoting.sol";
import { WithdrawERC20Voting } from "./votings/WithdrawERC20Voting.sol";
import { FeeVoting } from "./votings/FeeVoting.sol";
import { PercentageOfVotesToConfirmVoting } from "./votings/PercentageOfVotesToConfirmVoting.sol";
import { VotingTimeoutVoting } from "./votings/VotingTimeoutVoting.sol";
import { ValidatorStakeAmountVoting } from "./votings/ValidatorStakeAmountVoting.sol";
import { ValidatorStakeTimeoutVoting } from "./votings/ValidatorStakeTimeoutVoting.sol";
import { CustomTextVoting } from "./votings/CustomTextVoting.sol";
import { CertifiedConnectorVoting } from "./votings/CertifiedConnectorVoting.sol";
import { UnblockNodeVoting } from "./votings/UnblockNodeVoting.sol";
import { ValidatorBlockRewardsVoting } from "./votings/ValidatorBlockRewardsVoting.sol";
import { Dao } from "../dao/Dao.sol";

contract VotingsFactory is Initializable {
    mapping(address => bool) public votingsContracts;

    address payable public daoContract;
    address public withdrawVotingImplementation;
    address public withdrawERC20VotingImplementation;
    address public feesVotingImplementation;
    address public validatorStakeAmountVotingImplementation;
    address public validatorStakeTimeoutVotingImplementation;
    address public percentageOfVotesToConfirmVotingImplementation;
    address public votingTimeoutVotingImplementation;
    address public customTextVotingImplementation;
    address public certifiedConnectorVotingImplementation;
    address public unblockNodeVotingImplementation;
    address public validatorBlockRewardsVotingImplementation;

    event NewWithdrawVoting(address contractAddress, address recipient, uint256 amount);
    event NewWithdrawERC20Voting(
        address contractAddress,
        address recipient,
        address token,
        uint256 amount
    );
    event NewFeeVoting(address contractAddress, uint256 newFee);
    event NewValidatorStakeAmountVoting(address contractAddress, uint256 newValidatorStakeAmount);
    event NewValidatorStakeTimeoutVoting(address contractAddress, uint256 newValidatorStakeTimeout);
    event NewPercentageOfVotesToConfirmVoting(
        address contractAddress,
        uint256 newPercentageOfVotesToConfirm
    );
    event NewVotingTimeoutVoting(address contractAddress, uint256 newVotingTimeout);
    event NewCustomTextVoting(address contractAddress, bytes32 textHash);
    event NewCertifiedConnectorVoting(address contractAddress, bytes32 connectorHash, bool value);
    event NewUnblockNodeVoting(address contractAddress, bytes32 nodeHash);
    event NewValidatorBlockRewardsVoting(address contractAddress, uint256 newValidatorBlockRewards);

    constructor(
        address _withdrawVotingImplementation,
        address _withdrawERC20VotingImplementation,
        address _feesVotingImplementation,
        address _validatorStakeAmountVotingImplementation,
        address _validatorStakeTimeoutVotingImplementation,
        address _percentageOfVotesToConfirmVotingImplementation,
        address _votingTimeoutVotingImplementation,
        address _customTextVotingImplementation,
        address _certifiedConnectorVotingImplementation,
        address _unblockNodeVotingImplementation,
        address _validatorBlockRewardsVotingImplementation
    ) {
        withdrawVotingImplementation = _withdrawVotingImplementation;
        withdrawERC20VotingImplementation = _withdrawERC20VotingImplementation;
        feesVotingImplementation = _feesVotingImplementation;
        validatorStakeAmountVotingImplementation = _validatorStakeAmountVotingImplementation;
        validatorStakeTimeoutVotingImplementation = _validatorStakeTimeoutVotingImplementation;
        percentageOfVotesToConfirmVotingImplementation = _percentageOfVotesToConfirmVotingImplementation;
        votingTimeoutVotingImplementation = _votingTimeoutVotingImplementation;
        customTextVotingImplementation = _customTextVotingImplementation;
        certifiedConnectorVotingImplementation = _certifiedConnectorVotingImplementation;
        unblockNodeVotingImplementation = _unblockNodeVotingImplementation;
        validatorBlockRewardsVotingImplementation = _validatorBlockRewardsVotingImplementation;
    }

    function init(address payable _daoContract) external initializer {
        daoContract = _daoContract;
    }

    function enforceIsVotingContract(address _user) external view {
        require(votingsContracts[_user], "VotingsFactory: only votings contracts!");
    }

    function createWithdrawVoting(address _recipient, uint256 _amount) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newWithdrawVoting = address(
            new ERC1967Proxy(
                withdrawVotingImplementation,
                abi.encodeWithSelector(
                    WithdrawVoting.initialize.selector,
                    daoContract,
                    _recipient,
                    _amount
                )
            )
        );
        votingsContracts[newWithdrawVoting] = true;
        emit NewWithdrawVoting({
            contractAddress: newWithdrawVoting,
            recipient: _recipient,
            amount: _amount
        });
    }

    function createWithdrawERC20Voting(
        address _recipient,
        address _token,
        uint256 _amount
    ) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newWithdrawERC20Voting = address(
            new ERC1967Proxy(
                withdrawERC20VotingImplementation,
                abi.encodeWithSelector(
                    WithdrawERC20Voting.initialize.selector,
                    daoContract,
                    _recipient,
                    _token,
                    _amount
                )
            )
        );
        votingsContracts[newWithdrawERC20Voting] = true;
        emit NewWithdrawERC20Voting({
            contractAddress: newWithdrawERC20Voting,
            recipient: _recipient,
            token: _token,
            amount: _amount
        });
    }

    function createFeeVoting(uint256 _newFee) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newFeeVoting = address(
            new ERC1967Proxy(
                feesVotingImplementation,
                abi.encodeWithSelector(FeeVoting.initialize.selector, daoContract, _newFee)
            )
        );
        votingsContracts[newFeeVoting] = true;
        emit NewFeeVoting({ contractAddress: newFeeVoting, newFee: _newFee });
    }

    function createValidatorStakeAmountVoting(uint256 _newValidatorStakeAmount) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newValidatorStakeAmountVoting = address(
            new ERC1967Proxy(
                validatorStakeAmountVotingImplementation,
                abi.encodeWithSelector(
                    ValidatorStakeAmountVoting.initialize.selector,
                    daoContract,
                    _newValidatorStakeAmount
                )
            )
        );
        votingsContracts[newValidatorStakeAmountVoting] = true;
        emit NewValidatorStakeAmountVoting({
            contractAddress: newValidatorStakeAmountVoting,
            newValidatorStakeAmount: _newValidatorStakeAmount
        });
    }

    function createValidatorStakeTimeoutVoting(uint256 _newValidatorStakeTimeout) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newValidatorStakeTimeoutVoting = address(
            new ERC1967Proxy(
                validatorStakeTimeoutVotingImplementation,
                abi.encodeWithSelector(
                    ValidatorStakeTimeoutVoting.initialize.selector,
                    daoContract,
                    _newValidatorStakeTimeout
                )
            )
        );
        votingsContracts[newValidatorStakeTimeoutVoting] = true;
        emit NewValidatorStakeTimeoutVoting({
            contractAddress: newValidatorStakeTimeoutVoting,
            newValidatorStakeTimeout: _newValidatorStakeTimeout
        });
    }

    function createPercentageOfVotesToConfirmVoting(uint256 _newPercentageOfVotesToConfirm)
        external
    {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newPercentageOfVotesToConfirmVoting = address(
            new ERC1967Proxy(
                percentageOfVotesToConfirmVotingImplementation,
                abi.encodeWithSelector(
                    PercentageOfVotesToConfirmVoting.initialize.selector,
                    daoContract,
                    _newPercentageOfVotesToConfirm
                )
            )
        );
        votingsContracts[newPercentageOfVotesToConfirmVoting] = true;
        emit NewPercentageOfVotesToConfirmVoting({
            contractAddress: newPercentageOfVotesToConfirmVoting,
            newPercentageOfVotesToConfirm: _newPercentageOfVotesToConfirm
        });
    }

    function createVotingTimeoutVoting(uint256 _newVotingTimeout) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newVotingTimeoutVoting = address(
            new ERC1967Proxy(
                votingTimeoutVotingImplementation,
                abi.encodeWithSelector(
                    VotingTimeoutVoting.initialize.selector,
                    daoContract,
                    _newVotingTimeout
                )
            )
        );
        votingsContracts[newVotingTimeoutVoting] = true;
        emit NewVotingTimeoutVoting({
            contractAddress: newVotingTimeoutVoting,
            newVotingTimeout: _newVotingTimeout
        });
    }

    function createCustomTextVoting(bytes32 _textHash) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newCustomTextVoting = address(
            new ERC1967Proxy(
                customTextVotingImplementation,
                abi.encodeWithSelector(CustomTextVoting.initialize.selector, daoContract, _textHash)
            )
        );
        votingsContracts[newCustomTextVoting] = true;
        emit NewCustomTextVoting({ contractAddress: newCustomTextVoting, textHash: _textHash });
    }

    function createCertifiedConnectorVoting(bytes32 _connectorHash, bool _value) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newCertifiedConnectorVoting = address(
            new ERC1967Proxy(
                certifiedConnectorVotingImplementation,
                abi.encodeWithSelector(
                    CertifiedConnectorVoting.initialize.selector,
                    daoContract,
                    _connectorHash,
                    _value
                )
            )
        );
        votingsContracts[newCertifiedConnectorVoting] = true;
        emit NewCertifiedConnectorVoting({
            contractAddress: newCertifiedConnectorVoting,
            connectorHash: _connectorHash,
            value: _value
        });
    }

    function createUnblockNodeVoting(bytes32 _nodeHash) external {
        Dao dao = Dao(daoContract);
        dao.enforceIsVotingUser(msg.sender);
        require(dao.blockedNodes(_nodeHash), "VotingsFactory: node not blocked");
        address newUnblockNodeVoting = address(
            new ERC1967Proxy(
                unblockNodeVotingImplementation,
                abi.encodeWithSelector(
                    UnblockNodeVoting.initialize.selector,
                    daoContract,
                    _nodeHash
                )
            )
        );
        votingsContracts[newUnblockNodeVoting] = true;
        emit NewUnblockNodeVoting({ contractAddress: newUnblockNodeVoting, nodeHash: _nodeHash });
    }

    function createValidatorBlockRewardsVoting(uint256 _newValidatorBlockRewards) external {
        Dao(daoContract).enforceIsVotingUser(msg.sender);
        address newValidatorBlockRewardsVoting = address(
            new ERC1967Proxy(
                validatorBlockRewardsVotingImplementation,
                abi.encodeWithSelector(
                    ValidatorBlockRewardsVoting.initialize.selector,
                    daoContract,
                    _newValidatorBlockRewards
                )
            )
        );
        votingsContracts[newValidatorBlockRewardsVoting] = true;
        emit NewValidatorBlockRewardsVoting({
            contractAddress: newValidatorBlockRewardsVoting,
            newValidatorBlockRewards: _newValidatorBlockRewards
        });
    }
}
