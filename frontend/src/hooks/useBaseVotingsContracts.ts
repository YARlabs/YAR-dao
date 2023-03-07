import { JsonRpcProvider } from '@ethersproject/providers';
import { useEthers } from "@usedapp/core"
import { BaseVoting__factory } from '../typechain';


export const useBaseVotingsContracts = () => {
    const { library } = useEthers();

    return (contractAddress: string) => {
        if (library) {
            return BaseVoting__factory.connect(contractAddress!, (library as JsonRpcProvider)?.getSigner());
        }
    };
}