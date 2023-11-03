import React from "react";
import Link from "next/link";
import { useSharedState } from "../sharedStateContext";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { AccountConnectButton } from "~~/components/multisigcontract/AccountConnectButton";
import { FundContract } from "~~/components/multisigcontract/assetsOwners/FundContract";
import { MultiSigWalletOverview } from "~~/components/multisigcontract/assetsOwners/MultiSigWalletOverview";
import { ContractList } from "~~/components/multisigcontract/createContract/ContractList";
import { ListTransactions } from "~~/components/multisigcontract/transactions/ListTransactions";
import { SubmitTransaction } from "~~/components/multisigcontract/transactions/SubmitTransaction";

const Transactions: NextPage = () => {
  const { multiSigWalletAddress } = useSharedState();
  const { walletConnected } = useSharedState();
  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        {!isConnected ? (
          <div className="flex justify-center flex-col h-screen items-center">
            <span className="text-xl font-bold"> No wallet connected </span>
          </div>
        ) : multiSigWalletAddress == "" ? (
          <div>
            <div className="flex justify-center mt-5">
              <div className="text-center mb-4 mt-5">
                <span className="block text-2xl font-bold">Select your Multi Sig Wallet </span>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <ContractList myAddress={address} />
            </div>
          </div>
        ) : (
          <div className="container mx-auto flex flex-col mt-5">
            <div className="text-center ">
              <span className="block text-2xl font-bold">💸 Transactions</span>
            </div>
            <div className="flex justify-center mt-5">
              <MultiSigWalletOverview multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-10">
              <FundContract multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-5">
              <ListTransactions multiSigWalletAddress={multiSigWalletAddress} />
            </div>
            <div className="flex justify-center mt-10">
              <SubmitTransaction multiSigWalletAddress={multiSigWalletAddress} />
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

export default Transactions;
