import { useState, useEffect } from 'react';
import { Event } from 'ethers';
import { useGetLogs } from "../../hooks/useGetLogs";
import { EventFilter } from 'ethers';
import { filters } from '../../utils/filters';
import { votingDuration } from '../../utils/constants'; 
import { provider } from '../../utils/provider';
import EthDater from 'ethereum-block-by-date';
import WithdrawVoting from '../../components/voting-items/withdraw';
import WithdrawERC20Voting from '../../components/voting-items/withdrawERC20';
import FeeVoting from '../../components/voting-items/fee';
import ValidatorStakeAmountVoting from '../../components/voting-items/validatorStakeAmount';
import ValidatorStakeTimeoutVoting from '../../components/voting-items/validatorStakeTimeout';
import PercentageOfVotesToConfirmVoting from '../../components/voting-items/percentageOfVotesToConfirm';
import VotingTimeoutVoting from '../../components/voting-items/votingTimeout';
import CustomTextVoting from '../../components/voting-items/customText';
import CertifiedConnectorVoting from '../../components/voting-items/certifiedConnector';
import UnblockNodeVoting from '../../components/voting-items/unblockNode';
import ValidatorBlockRewardsVoting from '../../components/voting-items/validatorBlockRewards';

const ProcessVoting = () => {
    const [currentVotings, setCurrentVotings] = useState<Array<Event[]>>([]);
    const getLogsHook = useGetLogs();
    const dater = new EthDater(
        provider
    );
    
    useEffect(
        () => {   
            setCurrentVotings([]);     
            const currentTimestamp = Date.now();
            const fetchData = async () => {
                const fromBlockResult = await dater.getDate(
                    currentTimestamp - ( votingDuration + 10 ) * 1000
                )
                const toBlock = await provider.getBlockNumber();
                const allLogs = []
                for(let i = 0; i < filters.length; i++) {
                    const filter: EventFilter = filters[i];
                    const logs = await getLogsHook(filter, fromBlockResult.block, toBlock) as Event[];   
                    allLogs.push(logs);
                }
                setCurrentVotings(
                    allLogs 
                )
            }
            fetchData().catch(console.error);
        }, 
        []
    );

    return (
        <>
            <div className="m-3">
                {currentVotings.length < 11 && <div className="spinner"></div>}
                {currentVotings.length === 11 && currentVotings[0].length > 0 && currentVotings[0].map(e => <WithdrawVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[1].length > 0 && currentVotings[1].map(e => <WithdrawERC20Voting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[2].length > 0 && currentVotings[2].map(e => <FeeVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[3].length > 0 && currentVotings[3].map(e => <ValidatorStakeAmountVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[4].length > 0 && currentVotings[4].map(e => <ValidatorStakeTimeoutVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[5].length > 0 && currentVotings[5].map(e => <PercentageOfVotesToConfirmVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[6].length > 0 && currentVotings[6].map(e => <VotingTimeoutVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[7].length > 0 && currentVotings[7].map(e => <CustomTextVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[8].length > 0 && currentVotings[8].map(e => <CertifiedConnectorVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[9].length > 0 && currentVotings[9].map(e => <UnblockNodeVoting event={e} key={e.blockHash} />)}
                {currentVotings.length === 11 && currentVotings[10].length > 0 && currentVotings[10].map(e => <ValidatorBlockRewardsVoting event={e} key={e.blockHash} />)}
            </div>
        </>
    )
}

export default ProcessVoting;