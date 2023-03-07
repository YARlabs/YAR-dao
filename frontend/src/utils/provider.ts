import { providers } from "ethers";
const RPC = process.env.REACT_APP_RPC_YAR as string;

export const provider = new providers.JsonRpcProvider(RPC);
