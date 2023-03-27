import { useCallback } from "react";
import axios from 'axios';

export const useSendDescription = () => {
    
    return useCallback(
      async (addressVoting: string, addressPublic: string, signature: string, description: string) => {
        try {
            const request = await axios.post('https://dao.testnet.yarchain.org/api/voting', {
                    address: addressVoting,
                    public_address: addressPublic,
                    signature: signature,
                    description: description
                },
                {
                    headers: {}
                }
            )
            return request;
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