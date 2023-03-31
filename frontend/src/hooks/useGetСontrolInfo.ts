import VotingsFactory from '../abi/Dao.json';
import { useCallback } from "react";
import { Contract } from "ethers";
import { provider } from "../utils/provider";
const addressDao = process.env.REACT_APP_DAO_CONTRACT as string;
export const contractDao = new Contract(addressDao, VotingsFactory, provider);

export const useGetControlInfo = () => {
    return useCallback(
      async () => {
        try {
            const totalCount = Number(await contractDao?.votingUsersCount()); 
            const acceptedPercent = Number(await contractDao?.percentageOfVotesToConfirm());
            const acceptedCount = Math.trunc((acceptedPercent * totalCount) / 10000) + 1;
            console.log("acceptedCount", acceptedCount);
            return acceptedCount;
        } catch (error: any) {
            const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Check console logs for error";
            console.error(error);
            console.error(errorMessage);
        }
      },
      []
    );
  };