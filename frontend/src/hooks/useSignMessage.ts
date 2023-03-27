import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { JsonRpcProvider } from '@ethersproject/providers';
import { Signer } from "@ethersproject/abstract-signer";

export const useSignMessage = () => {
  const { library } = useEthers()

  return useCallback(
    async (message: string) => {
        if(!library) {
            return
        }
        const signer: Signer = (library as JsonRpcProvider).getSigner();
        const signature = signer.signMessage(message);
        return signature;
    },
    [library]
  );
};