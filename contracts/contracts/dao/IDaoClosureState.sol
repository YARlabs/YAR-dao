// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { VotingsFactory } from "../votings_factory/VotingsFactory.sol";

abstract contract IDaoClosureState is ReentrancyGuard {
    VotingsFactory public votingsFactory;
}

