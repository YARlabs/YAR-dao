import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useBaseVotingsContracts } from "./useBaseVotingsContracts";

export const useVote = () => {
  const { switchNetwork } = useEthers();
  const BaseVotingTemplate = useBaseVotingsContracts();

  return useCallback(
    async (votingAddress: string, isAccept: boolean) => {
      await switchNetwork(10226688);
      const votingContract = BaseVotingTemplate(votingAddress);
      try {
        let tx;
        if(isAccept) {
          const txPromise = await votingContract?.accept();
          tx = await txPromise?.wait();
        } else {
          const txPromise = await votingContract?.reject();
          tx = await txPromise?.wait();
        }
        return tx;
      } catch (error: any) {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Check console logs for error";
        console.error(error);
        console.error(errorMessage);
      }
    },
    [switchNetwork, BaseVotingTemplate]
  );
};