import { useCallback } from "react"; 
import VotingsFactory from '../abi/VotingsFactory.json';
import { Contract, EventFilter } from "ethers";
import { provider } from "../utils/provider";
const addressFactory = process.env.REACT_APP_FACTORY_CONTRACT as string;
export const contractFactory = new Contract(addressFactory, VotingsFactory, provider);

export const useGetLogs = () => {

    return useCallback(
        async (filter: EventFilter, blockFrom?: number, toBlock?: number) => {  
            try {
                const results = await contractFactory.queryFilter(filter, blockFrom, toBlock)
                return results;
            } catch(error: any) {
                const errorMessage =
                    error?.error?.message ||
                    error?.message ||
                    "Check console logs for error";
                console.error(error);
                console.error(errorMessage);
            } 
        }
        ,[]
    );
}
