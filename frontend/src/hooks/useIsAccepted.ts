import { useCallback } from "react";
import { useBaseVotingsContracts } from "./useBaseVotingsContracts";

export const useIsAccepted = () => {
    const BaseVotingTemplate = useBaseVotingsContracts();
  
    return useCallback(
      async (votingAddress: string) => {
        const votingContract = BaseVotingTemplate(votingAddress);
        try {
            const response = await votingContract?.isAccepted();
            console.log('response', response);
            return response;
        } catch (error: any) {
            const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Check console logs for error";
            console.error(error);
            console.error(errorMessage);
        }
      },
      [BaseVotingTemplate]
    );
  };