import { useCallback } from "react";
import { useBaseVotingsContracts } from "./useBaseVotingsContracts";
import { votingDuration } from "../utils/constants";
import { getValidDate } from "../utils/get-valid-date";

export const useGetVotingInfo = () => {
    const BaseVotingTemplate = useBaseVotingsContracts();
    return useCallback(
      async (votingAddress: string) => {
        const votingContract = BaseVotingTemplate(votingAddress);
        try {
            const acceptedAmount = (await votingContract?.acceptedAmount())?.toString();
            const rejectedAmount = (await votingContract?.rejectedAmount())?.toString();
            const startVotingMilliseconds = Number(await votingContract?.initTimestamp()) * 1000;
            const endVotingMilliseconds = startVotingMilliseconds + votingDuration * 1000;
            const start = getValidDate(startVotingMilliseconds);
            const end = getValidDate(endVotingMilliseconds);
            return {acceptedAmount, rejectedAmount, start, end};
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