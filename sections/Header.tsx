import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_CHAIN_ID } from "../config/constants";
import { useOnboard } from "../context/OnboardContext";

const Header = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const onboard = useOnboard();

  const handleConnectWallet = async () => {
    try {
      const wallets = await onboard?.connectWallet({});
      if (!wallets || wallets?.length === 0) {
        return;
      }
      await onboard?.setChain({ chainId: DEFAULT_CHAIN_ID });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-black">
      <nav className="container flex flex-wrap items-center justify-between p-4 mx-auto">
        <div className="flex items-center flex-shrink-0 mr-10 text-white">
          <Link href="/">
            <a>
              <Image src={"/logo.png"} alt="logo" width="72px" height="48px" />
            </a>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 text-white border border-white hover:text-white hover:border-white">
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="flex-grow block w-full lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
          </div>
          <div>
            <button
              className={classNames({
                "text-white bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-full":
                  true,
                hidden: !!wallet,
              })}
              onClick={handleConnectWallet}
            >
              {connecting ? "Connecting" : "Connect"} Wallet
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
