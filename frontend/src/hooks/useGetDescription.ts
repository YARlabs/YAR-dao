import { useCallback } from "react";
import axios from 'axios';

export const useGetDescription = () => {
    return useCallback(
      async (addressVoting: string) => {
        try {
            const response = await axios.get(`https://dao.testnet.yarchain.org/api/voting/${addressVoting}`);
            console.log("response", response);
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
      []
    );
  };