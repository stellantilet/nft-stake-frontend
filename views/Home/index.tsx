import {useConnectWallet, useSetChain} from "@web3-onboard/react";
import type {NextPage} from "next";
import Head from "next/head";
import {useEffect, useState} from "react";
import BaseLayout from "../Layouts/BaseLayout";
import {CHAIN_INFO, DEFAULT_CHAIN_ID} from "../../config/constants";
import {ContractReceipt, ContractTransaction, ethers} from "ethers";
import CONTRACTS from "../../config/contracts";
import {toast} from "react-toastify";
import useSWR, {SWRConfig} from 'swr'
import contractService from "../../services/contract/ContractService";

const Home: NextPage = () => {
    const [{wallet, connecting}, connectWallet] = useConnectWallet();
    const [{chains, settingChain}, setChain] = useSetChain();
    const [mintAmount, setMintAmount] = useState(0);
    const [stakeAmount, setStakeAmount] = useState(0);

    const readProvider = new ethers.providers.JsonRpcProvider(
        CHAIN_INFO[DEFAULT_CHAIN_ID].rpc
    );

    const disabled = !wallet;

    const {data: reward} = useSWR('reward', async () => {
        const stakeContract = contractService.stake.connect(readProvider)
        const _reward = await stakeContract.rewardOfUser(wallet?.accounts[0].address);
        return Number(ethers.utils.formatEther((_reward.toString())))
    })

    const {data: mintedAmount} = useSWR('mintedAmount', async () => {
        const nftContract = contractService.nft.connect(readProvider)
        const _mintedAmount = await nftContract.balanceOf(wallet?.accounts[0].address);
        return _mintedAmount.toNumber();
    })

    const {data: stakedAmount} = useSWR('stakedAmount', async () => {
        const stakeContract = contractService.stake.connect(readProvider)
        const _userInfo = await stakeContract.userInfos(wallet?.accounts[0].address);
        return _userInfo.depositedAmount.toNumber();
    })

    const getSigner = async () => {
        if (disabled) {
            return false;
        }

        await setChain({chainId: DEFAULT_CHAIN_ID});
        if (!wallet?.provider) {
            return false;
        }

        const provider = new ethers.providers.Web3Provider(wallet?.provider);
        const signer = provider.getSigner();
        return signer;
    }

    const handleMint = async () => {
        const signer = await getSigner()
        if (!signer) return
        const nftContract = contractService.nft.connect(signer);

        try {
            let tx: ContractTransaction = await nftContract.mint(mintAmount);
            let receipt: ContractReceipt = await tx.wait();
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    break;
                default:
                    toast("failed");
                    break;
            }
        }
    };

    const handleStake = async () => {
        const signer = await getSigner()
        if (!signer) return
        const stakeContract = contractService.stake.connect(signer)
        const nftContract = contractService.nft.connect(signer);

        try {
            let tx: ContractTransaction = await nftContract.multiApprove(CONTRACTS.stake.addresses[DEFAULT_CHAIN_ID], mintAmount);
            await tx.wait();
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    break;
                default:
                    toast("failed");
                    break;
            }
        }

        try {
            let tx: ContractTransaction = await stakeContract.depositNFT(stakeAmount);
            await tx.wait();
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    break;
                default:
                    toast("failed");
                    break;
            }
        }
    };

    const handleClaim = async () => {
        const signer = await getSigner()
        if (!signer) return
        const stakeContract = contractService.stake.connect(signer)

        try {
            let tx: ContractTransaction = await stakeContract.claimReward({});
            await tx.wait();
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    break;
                default:
                    toast("failed");
                    break;
            }
        }
    }

    return (
        <>
            <Head>
                <title>NFT Staking</title>
            </Head>
            <BaseLayout>
                <div className="max-w-md px-4 py-10 mx-auto">
                    <div className="grid grid-cols-2 mt-2">
                        <span>Mint NFT</span>
                        <div className="flex">
                            <input
                                type="number"
                                min={1}
                                className="w-20 py-2 pl-2 border-2 border-black outline-none"
                                value={mintAmount}
                                onChange={(e) => {
                                    setMintAmount(Number(e.target.value));
                                }}
                            />
                            <button
                                disabled={disabled}
                                className="w-24 px-5 py-2 text-center text-white transition-colors bg-gray-900 disabled:bg-gray-500 hover:bg-gray-700"
                                onClick={handleMint}
                            >
                                <span className="flex justify-center"> Mint </span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 mt-2">
                        <span>Stake NFT</span>
                        <div className="flex">
                            <input
                                type="number"
                                min={stakeAmount}
                                className="w-20 py-2 pl-2 border-2 border-black outline-none"
                                onChange={(e) => {
                                    setStakeAmount(Number(e.target.value));
                                }}
                            />
                            <button
                                disabled={disabled}
                                className="w-24 px-5 py-2 text-white transition-colors bg-gray-900 disabled:bg-gray-500 hover:bg-gray-700"
                                onClick={handleStake}
                            >
                                <span className="flex justify-center"> Stake </span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <span>Staked Amount</span>
                        <span>{stakedAmount}</span>
                    </div>
                    <div className="grid grid-cols-2 mt-2">
                        <span>Remain Minted Amount</span>
                        <span>{mintedAmount}</span>
                    </div>
                    <div className="grid grid-cols-2 mt-2">
                        <span>Reward</span>
                        <span>{reward}</span>
                    </div>
                    <button
                        disabled={disabled}
                        className="px-5 py-2 text-white transition-colors bg-gray-900 disabled:bg-gray-500 hover:bg-gray-700"
                        onClick={handleClaim}
                    >
                        <span className="flex items-center"> Claim Rewards </span>
                    </button>
                </div>
            </BaseLayout>
        </>
    );
};

export default Home;
