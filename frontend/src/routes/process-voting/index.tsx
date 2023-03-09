import { useState, useEffect } from 'react';
import { Event } from 'ethers';
import { useGetLogs } from "../../hooks/useGetLogs";
import { EventFilter } from 'ethers';
import { filters } from '../../utils/filters';
import { votingDuration } from '../../utils/constants'; 
import { provider } from '../../utils/provider';
import EthDater from 'ethereum-block-by-date';
import ComponentsItem from '../../components/components-item';

const ProcessVoting = () => {
    const [allVotings, setAllVotings] = useState<Array<Event>>([]);

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
                const toBlock = await provider.getBlockNumber();
                const allLogs = [];
                for(let i = 0; i < filters.length; i++) {
                    const filter: EventFilter = filters[i];
                    const logs = await getLogsHook(filter, fromBlockResult.block, toBlock) as Event[];   
                    allLogs.push(...logs);
                }
                allLogs.sort((a, b) => a.blockNumber > b.blockNumber ? -1 : 1);
                setAllVotings(allLogs);
            }
            fetchData().catch(console.error);
        }, 
        []
    );

    return (
        <>
            <div className="m-3">
                {allVotings.length === 0 && <div className="spinner"></div>}
                {allVotings.length > 0 && allVotings.map(block => ComponentsItem(block))}
            </div>
        </>
    )
}

export default ProcessVoting;