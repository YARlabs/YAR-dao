import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useBaseVotingsContracts } from "./useBaseVotingsContracts";
import { toast } from "react-toastify";

export const useVote = () => {
  const { account, switchNetwork } = useEthers();
  const BaseVotingTemplate = useBaseVotingsContracts();

  return useCallback(
    async (votingAddress: string, isAccept: boolean) => {
      await switchNetwork(10226688);
      const votingContract = BaseVotingTemplate(votingAddress);
      if(!account) {
        toast.warning('Wallet not connected', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
        return
      }
      try {
        let tx;
        if(isAccept) {
          const txPromise = await votingContract?.accept();
          toast.info('Sending a transaction', {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
          });
          tx = await txPromise?.wait();
        } else {
          const txPromise = await votingContract?.reject();
          toast.info('Sending a transaction', {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
          });
          tx = await txPromise?.wait();
        }
        toast.success('You have successfully voted', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
        return tx;
      } catch (error: any) {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Check console logs for error";
        console.error(error);
        console.error(errorMessage);
        toast.error('Error!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: false,
          draggable: true,
          theme: "colored",
        });
      }
    },
    [switchNetwork, BaseVotingTemplate, account]
  );
};