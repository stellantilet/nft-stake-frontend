import { Contract, ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../../config/constants";
import CONTRACTS from "../../config/contracts";

class ContractService {
  protected nftContract: Contract | null = null;
  protected stakeContract: Contract | null = null;

  get nft() {
    if (this.nftContract == null) {
      this.nftContract = new ethers.Contract(
        CONTRACTS.nft.addresses[DEFAULT_CHAIN_ID],
        CONTRACTS.nft.abi
      );
    }
    return this.nftContract;
  }

  get stake() {
    if (this.stakeContract == null) {
      this.stakeContract = new ethers.Contract(
          CONTRACTS.stake.addresses[DEFAULT_CHAIN_ID],
          CONTRACTS.stake.abi
      );
    }
    return this.stakeContract;
  }
}

const contractService = new ContractService();
export default contractService;
