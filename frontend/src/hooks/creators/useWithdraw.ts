import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "../useContracts";
import { toast } from "react-toastify";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: 60 });

export const useWithdraw = () => {
  const { factoryContract } = useContracts();
  const { switchNetwork } = useEthers();

  return useCallback(
    async (recipient: string, amount: string) => {
      if (!factoryContract) return;
      await switchNetwork(10226688);
      const bigAmount = new BigNumber(amount).shiftedBy(+18);   
      try {
        const txPromise = await factoryContract.createWithdrawVoting(recipient, bigAmount.toString());
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
