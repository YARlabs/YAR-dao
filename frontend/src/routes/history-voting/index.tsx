import { useEffect } from 'react';
import { Event } from 'ethers';
import { useGetLogs } from "../../hooks/useGetLogs";
import { EventFilter } from 'ethers';
import { filters } from '../../utils/filters';
import ComponentsItem from '../../components/components-item';
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import HistoryPagination from '../../components/pagination/history';

const HistoryVoting = () => {
    const {historyVotings, currentHistoryVotings} = useTypedSelector(state => state.main);
    const {SetHistoryVotings} = useActions();
    const getLogsHook = useGetLogs();
    
    useEffect(
        () => {   
            const fetchData = async () => {
                const allLogs = []
                for(let i = 0; i < filters.length; i++) {
                    const filter: EventFilter = filters[i];
                    const logs = await getLogsHook(filter) as Event[];   
                    allLogs.push(...logs);
                }
                allLogs.sort((a, b) => a.blockNumber > b.blockNumber ? -1 : 1);
                SetHistoryVotings(allLogs);
            }
            fetchData().catch(console.error);
        }, 
        []
    );

    return (
        <>
            <div className="m-3">
                {currentHistoryVotings.length === 0 && <div className="spinner"></div>}
                {currentHistoryVotings.length > 0 && currentHistoryVotings.map(block => ComponentsItem(block))}
            </div>
            <HistoryPagination />
        </>
    )
}

export default HistoryVoting;