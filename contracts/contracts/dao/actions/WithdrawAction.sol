// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract WithdrawAction is IDaoClosureState {
    struct WithdrawRequest {
        address recipient;
        uint256 amount;
    }

    uint256 public firstWithdrawRequest;
    uint256 public lastWithdrawRequest;
    mapping(uint256 => WithdrawRequest) public withdrawRequests;

    event NewWithdrawRequest(address indexed recipient, uint256 amount);
    event Withdrawn(uint256 indexed requestId, address indexed recipient, uint256 amount);

    receive() external payable {}

    function hasWithdrawRequestInQueue() public view returns (bool) {
        return firstWithdrawRequest < lastWithdrawRequest;
    }

    function addNewWithdrawRequest(address _recipient, uint256 _amount) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        withdrawRequests[lastWithdrawRequest++] = WithdrawRequest({
            recipient: _recipient,
            amount: _amount
        });
        emit NewWithdrawRequest({ recipient: _recipient, amount: _amount });
    }

    function withdrawFromQueue() external nonReentrant {
        require(hasWithdrawRequestInQueue(), "Dao: not has requests in queue");

        uint256 requestId = firstWithdrawRequest;
        WithdrawRequest memory request = withdrawRequests[requestId];

        if (address(this).balance >= request.amount) {
            firstWithdrawRequest++;
            (bool success, ) = payable(request.recipient).call{ value: request.amount }("");
            require(success, "Dao: withdraw failure!");
            emit Withdrawn({
                requestId: requestId,
                recipient: request.recipient,
                amount: request.amount
            });
        }
    }
}
