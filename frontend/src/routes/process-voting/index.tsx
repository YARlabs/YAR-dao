import { useState, useEffect } from 'react';
import { Event } from 'ethers';
import { useGetLogs } from "../../hooks/useGetLogs";
import { useGetControlInfo } from '../../hooks/useGetСontrolInfo';
import { EventFilter } from 'ethers';
import { filters } from '../../utils/filters';
import { votingDuration } from '../../utils/constants'; 
import { provider } from '../../utils/provider';
import EthDater from 'ethereum-block-by-date';
import ComponentsItem from '../../components/components-item';
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";

const ProcessVoting = () => {
    const {processVotings} = useTypedSelector(state => state.main);
    const {SetProcessVotings} = useActions();
    const [noneVotings, setNoneVotings] = useState(false);
    const [controlCount, setControlCount] = useState(0);

    const controlInfoHook = useGetControlInfo();
    const getLogsHook = useGetLogs();
    const dater = new EthDater(
        provider
    );
    
    useEffect(
        () => {    
            const currentTimestamp = Date.now();
            const fetchData = async () => {
                const fromBlockResult = await dater.getDate(
                    currentTimestamp - ( votingDuration + 10 ) * 1000
                )                
                const count = await controlInfoHook() as number;
                setControlCount(count);
                const toBlock = await provider.getBlockNumber();
                const allLogs = [];
                for(let i = 0; i < filters.length; i++) {
                    const filter: EventFilter = filters[i];
                    const logs = await getLogsHook(filter, fromBlockResult.block, toBlock) as Event[];   
                    allLogs.push(...logs);
                }
                allLogs.sort((a, b) => a.blockNumber > b.blockNumber ? -1 : 1);
                if(allLogs.length) { 
                    SetProcessVotings(allLogs);
                } else {
                    setNoneVotings(true);
                }
            }
            fetchData().catch(console.error);
        }, 
        []
    );

    return (
        <>
            <div className="m-3">
                Number of votes to approve: { controlCount }
                {processVotings.length === 0 && !noneVotings && <div className="spinner"></div>}
                {noneVotings && <div>There are no actual votes yet</div>}
                {processVotings.length > 0 && processVotings.map(block => ComponentsItem(block))}
            </div>
        </>
    )
}

export default ProcessVoting;