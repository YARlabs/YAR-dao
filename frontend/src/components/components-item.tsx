import React from "react";
import { Event } from "ethers"; 
import WithdrawVoting from "./voting-items/withdraw";
import WithdrawERC20Voting from "./voting-items/withdrawERC20";
import FeeVoting from './voting-items/fee';
import ValidatorStakeAmountVoting from './voting-items/validatorStakeAmount';
import ValidatorStakeTimeoutVoting from './voting-items/validatorStakeTimeout';
import PercentageOfVotesToConfirmVoting from './voting-items/percentageOfVotesToConfirm';
import VotingTimeoutVoting from './voting-items/votingTimeout';
import CustomTextVoting from './voting-items/customText';
import CertifiedConnectorVoting from './voting-items/certifiedConnector';
import UnblockNodeVoting from './voting-items/unblockNode';
import ValidatorBlockRewardsVoting from './voting-items/validatorBlockRewards';

type IProp = {
  event: Event
}
interface IdToFilter {
  [x: string]: (props: IProp) => JSX.Element;
}

const Components :IdToFilter = {
  "NewWithdrawVoting": WithdrawVoting,
  "NewWithdrawERC20Voting": WithdrawERC20Voting, 
  "NewFeeVoting": FeeVoting,
  "NewValidatorStakeAmountVoting": ValidatorStakeAmountVoting, 
  "NewValidatorStakeTimeoutVoting": ValidatorStakeTimeoutVoting,
  "NewPercentageOfVotesToConfirmVoting": PercentageOfVotesToConfirmVoting,
  "NewVotingTimeoutVoting": VotingTimeoutVoting, 
  "NewCustomTextVoting": CustomTextVoting,
  "NewCertifiedConnectorVoting": CertifiedConnectorVoting,
  "NewUnblockNodeVoting": UnblockNodeVoting,
  "NewValidatorBlockRewardsVoting": ValidatorBlockRewardsVoting
};

const ComponentsItem = (Props: Event) => {
  const event: string = Props.event as string;
  return React.createElement(Components[event], {
      key: Props.blockHash,
      event: Props
  });
}

export default ComponentsItem;