// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { Dao } from "../../dao/Dao.sol";

abstract contract BaseVoting is Initializable {
    uint256 public initTimestamp;
    Dao public daoContract;
    bool public isOver;
    bool public isAccepted;
    uint256 public acceptedAmount;
    uint256 public rejectedAmount;
    mapping(address => bool) votedUsers;

    event NewAcceptVote(address indexed user);
    event NewRejectVote(address indexed user);
    event VotingFinished(bool accepted);

    modifier votingNotOver() {
        require(!isOver, "Voting: is over!");
        _;
    }

    modifier notVotedUser() {
        require(!votedUsers[msg.sender], "Voting: already vote!");
        _;
    }

    function baseVotingInitialize(address payable _daoContract) internal initializer {
        initTimestamp = block.timestamp;
        daoContract = Dao(_daoContract);
    }

    function accept() external votingNotOver notVotedUser {
        votedUsers[msg.sender] = true;

        Dao dao = daoContract;
        dao.enforceIsVotingNotExpired(initTimestamp);
        dao.enforceIsVotingUser(msg.sender);
    
        acceptedAmount++;
        emit NewAcceptVote({ user: msg.sender });

        if (dao.isVotingAccepted(acceptedAmount)) {
            isOver = true;
            isAccepted = true;
            execute();

            emit VotingFinished({ accepted: true });
        }
    }

    function reject() external votingNotOver notVotedUser {
        votedUsers[msg.sender] = true;

        Dao dao = daoContract;
        dao.enforceIsVotingNotExpired(initTimestamp);
        dao.enforceIsVotingUser(msg.sender);

        rejectedAmount++;
        emit NewRejectVote({ user: msg.sender });

        if (dao.isVotingRejected(rejectedAmount)) {
            isOver = true;
            isAccepted = false;
            emit VotingFinished({ accepted: false });
        }
    }

    function execute() internal virtual;
}
