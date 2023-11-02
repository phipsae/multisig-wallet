import React from "react";
import Link from "next/link";
import { useSharedState } from "../sharedStateContext";
import { getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { AccountConnectButton } from "~~/components/multisigcontract/AccountConnectButton";
import { AddOwners } from "~~/components/multisigcontract/AddOwners";
import { FundContract } from "~~/components/multisigcontract/FundContract";
import { MultiSigWalletOverview } from "~~/components/multisigcontract/MultiSigWalletOverview";
import { ShowOwnersRemove } from "~~/components/multisigcontract/ShowOwnersRemove";

const AssetsOwners: NextPage = () => {
  const { multiSigWalletAddress } = useSharedState();
  const { walletConnected, setWalletConnected } = useSharedState();
  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        {!walletConnected ? (
          <AccountConnectButton walletConnect={true} address={getAccount().address?.toString() || ""} />
        ) : multiSigWalletAddress == "" ? (
          <div className="flex justify-center">
            <Link href="/createContract">
              <button className="btn btn-primary">Go to Create Contract Tab and select a multi sig wallet</button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto flex flex-col mt-10">
            <div className="flex justify-center mt-5">
              <MultiSigWalletOverview multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-5">
              <FundContract multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center">
              <ShowOwnersRemove multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-5">
              <AddOwners multiSigWalletAddress={multiSigWalletAddress} />
            </div>
          </div>
        )}
        {walletConnected && <AccountConnectButton walletConnect={false} address={""} />}
      </div>
    </>
  );
};

export default AssetsOwners;
