import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "../useContracts";

export const useValidatorStakeTimeout = () => {
  const { factoryContract } = useContracts();
  const { switchNetwork } = useEthers();

  return useCallback(
    async (days: string) => {
      if (!factoryContract) return;
      await switchNetwork(10226688);
      const seconds = Number(days) * 86400;   
      try {
        const txPromise = await factoryContract.createValidatorStakeTimeoutVoting(seconds);
        const tx = await txPromise.wait();
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
    [factoryContract, switchNetwork]
  );
};