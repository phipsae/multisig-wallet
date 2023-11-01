import React from "react";
import { useSharedState } from "../sharedStateContext";
import type { NextPage } from "next";
import { AddOwners } from "~~/components/multisigcontract/AddOwners";
import { FundContract } from "~~/components/multisigcontract/FundContract";
import { MultiSigWalletOverview } from "~~/components/multisigcontract/MultiSigWalletOverview";
import { ShowOwnersRemove } from "~~/components/multisigcontract/ShowOwnersRemove";

const AssetsOwners: NextPage = () => {
  const { multiSigWalletAddress } = useSharedState();
  return (
    <>
      <button onClick={() => console.log(multiSigWalletAddress)}>Click me for Address</button>
      {/* <button onClick={() => setSharedVariable("Huhu")}>Set to HUHU</button> */}
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
    </>
  );
};

export default AssetsOwners;
