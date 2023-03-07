import { contractFactory } from "../hooks/useGetLogs";

const filters = [
    contractFactory.filters.NewWithdrawVoting(null, null, null),
    contractFactory.filters.NewWithdrawERC20Voting(null, null, null, null),
    contractFactory.filters.NewFeeVoting(null, null),
    contractFactory.filters.NewValidatorStakeAmountVoting(null, null),
    contractFactory.filters.NewValidatorStakeTimeoutVoting(null, null),
    contractFactory.filters.NewPercentageOfVotesToConfirmVoting(null, null),
    contractFactory.filters.NewVotingTimeoutVoting(null, null),
    contractFactory.filters.NewCustomTextVoting(null, null),
    contractFactory.filters.NewCertifiedConnectorVoting(null, null, null),
    contractFactory.filters.NewUnblockNodeVoting(null, null),
    contractFactory.filters.NewValidatorBlockRewardsVoting(null, null)
]
    
export { filters };