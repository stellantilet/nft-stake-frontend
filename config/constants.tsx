import { ChainID } from "../types";

export const DEFAULT_CHAIN_ID: ChainID = ChainID.Rinkeby;

export const CHAIN_INFO = {
  [ChainID.Rinkeby]: {
    rpc: "https://rinkeby.infura.io/v3/064beaa039ca4d0da18afb89892c7020",
  }
};
