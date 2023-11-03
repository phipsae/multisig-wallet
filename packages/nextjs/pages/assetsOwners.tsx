import React from "react";
import Link from "next/link";
import { useSharedState } from "../sharedStateContext";
import { getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { AccountConnectButton } from "~~/components/multisigcontract/AccountConnectButton";
import { AddOwners } from "~~/components/multisigcontract/assetsOwners/AddOwners";
import { FundContract } from "~~/components/multisigcontract/assetsOwners/FundContract";
import { MultiSigWalletOverview } from "~~/components/multisigcontract/assetsOwners/MultiSigWalletOverview";
import { ShowOwnersRemove } from "~~/components/multisigcontract/assetsOwners/ShowOwnersRemove";

const AssetsOwners: NextPage = () => {
  const { multiSigWalletAddress } = useSharedState();
  const { walletConnected } = useSharedState();
  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        {!walletConnected ? (
          <div className="flex justify-center mt-5">
            <AccountConnectButton walletConnect={true} address={getAccount().address?.toString() || ""} />
          </div>
        ) : multiSigWalletAddress == "" ? (
          <div className="flex justify-center">
            <Link href="/createContract">
              <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2">
                Select a multi sig wallet
              </button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto flex flex-col mt-5">
            <div className="text-center ">
              <span className="block text-2xl font-bold">🪪 Wallet & 👨‍👧‍👦 Signers</span>
            </div>
            <div className="flex justify-center mt-10">
              <MultiSigWalletOverview multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-10">
              <FundContract multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center">
              <ShowOwnersRemove multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-10">
              <AddOwners multiSigWalletAddress={multiSigWalletAddress} />
            </div>
          </div>
        )}
        <div className="flex justify-center mt-5">
          {walletConnected && <AccountConnectButton walletConnect={false} address={""} />}
        </div>
      </div>
    </>
  );
};

export default AssetsOwners;
