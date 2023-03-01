import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "../useContracts";
import { useERC20Contracts } from "../useERC20Contracts";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: 60 });

export const useWithdrawERC20 = () => {
  const { factoryContract } = useContracts();
  const { switchNetwork } = useEthers();
  const erc20ContractTemplate = useERC20Contracts();

  return useCallback(
    async (recipient: string, token: string, amount: string) => {
      if (!factoryContract) return;
      await switchNetwork(10226688);
      const erc20Contract = erc20ContractTemplate(token);
      const decimals = await erc20Contract?.decimals() as number;
    //   const decimals = 18;
      const bigNumberAmount = new BigNumber(amount).shiftedBy(+decimals); 
      try {
        const txPromise = await factoryContract.createWithdrawERC20Voting(recipient, token, bigNumberAmount.toString());
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
