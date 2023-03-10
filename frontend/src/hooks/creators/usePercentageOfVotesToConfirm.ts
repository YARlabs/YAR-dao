import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "../useContracts";
import { toast } from "react-toastify";  

export const usePercentageOfVotesToConfirm = () => {
  const { factoryContract } = useContracts();
  const { switchNetwork } = useEthers();

  return useCallback(
    async (fee: string) => {
      if (!factoryContract) return;
      await switchNetwork(10226688);
      const validValue = Math.trunc(Number(fee) * 100);   
      try {
        const txPromise = await factoryContract.createPercentageOfVotesToConfirmVoting(validValue);
        toast.info('Sending a transaction', {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
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
