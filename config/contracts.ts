import abiNFT from "../abis/NFT.json";
import abiStake from "../abis/Stake.json";
import { ChainID } from "../types";

const CONTRACTS = {
  nft: {
    addresses: {
      [ChainID.Rinkeby]: "0xDd276F0AF68bc778e044376207F045B042B5C6d1",
    },
    abi: abiNFT,
  },
  stake: {
    addresses: {
      [ChainID.Rinkeby]: "0x68dfaFee85c5a16Ea194f3DD37F3fb06Ab68dB0a",
    },
    abi: abiStake,
  },
};

export default CONTRACTS;
