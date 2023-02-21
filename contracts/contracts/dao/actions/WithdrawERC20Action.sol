// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IDaoClosureState } from "../IDaoClosureState.sol";

abstract contract WithdrawERC20Action is IDaoClosureState {
    using SafeERC20 for IERC20;

    struct WithdrawERC20Request {
        address recipient;
        address token;
        uint256 amount;
    }

    mapping(address => uint256) public firstWithdrawERC20Request;
    mapping(address => uint256) public lastWithdrawERC20Request;
    mapping(address => mapping(uint256 => WithdrawERC20Request)) public withdrawERC20Requests;

    event NewWithdrawERC20Request(address indexed recipient, address indexed token, uint256 amount);
    event WithdrawnERC20(
        uint256 indexed requestId,
        address indexed recipient,
        address indexed token,
        uint256 amount
    );

    function addNewWithdrawERC20Request(
        address _recipient,
        address _token,
        uint256 _amount
    ) external {
        votingsFactory.enforceIsVotingContract(msg.sender);
        withdrawERC20Requests[_token][lastWithdrawERC20Request[_token]++] = WithdrawERC20Request({
            recipient: _recipient,
            token: _token,
            amount: _amount
        });
        emit NewWithdrawERC20Request({ recipient: _recipient, token: _token, amount: _amount });
    }

    function withdrawERC20FromQueue(address _token) external nonReentrant {
        uint256 requestId = firstWithdrawERC20Request[_token];

        require(requestId < lastWithdrawERC20Request[_token], "Dao: not has requests in queue");

        WithdrawERC20Request memory request = withdrawERC20Requests[_token][requestId];

        IERC20 token = IERC20(_token);
        
        if (token.balanceOf(address(this)) >= request.amount) {
            firstWithdrawERC20Request[_token]++;
            token.safeTransfer(request.recipient, request.amount);
            emit WithdrawnERC20({
                requestId: requestId,
                recipient: request.recipient,
                token: _token,
                amount: request.amount
            });
        }
    }
}
