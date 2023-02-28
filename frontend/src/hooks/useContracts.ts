import { JsonRpcProvider } from '@ethersproject/providers';
import { useMemo } from 'react';
import { useEthers } from "@usedapp/core"
import { Dao__factory, VotingsFactory__factory } from '../typechain';


export const useContracts = () => {
    const { library } = useEthers();
    
    const daoContract = useMemo(() => {
        if (library) {
            return Dao__factory.connect(process.env.REACT_APP_DAO_CONTRACT!, (library as JsonRpcProvider)?.getSigner());
        }
    }, [library]);

    const factoryContract = useMemo(() => {
        if (library) {
            return VotingsFactory__factory.connect(process.env.REACT_APP_FACTORY_CONTRACT!, (library as JsonRpcProvider)?.getSigner());
        }
    }, [library]);

    return {
        daoContract,
        factoryContract,
    }
}