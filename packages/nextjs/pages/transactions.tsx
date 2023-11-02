import React from "react";
import { useSharedState } from "../sharedStateContext";
import type { NextPage } from "next";
import { ListTransactions } from "~~/components/multisigcontract/ListTransactions";
import { SubmitTransaction } from "~~/components/multisigcontract/SubmitTransaction";

const Transactions: NextPage = () => {
  const { multiSigWalletAddress } = useSharedState();

  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        <div className="flex justify-center mt-5">
          <ListTransactions multiSigWalletAddress={multiSigWalletAddress} />
        </div>
        <div className="flex justify-center mt-5">
          <SubmitTransaction multiSigWalletAddress={multiSigWalletAddress} />
        </div>
      </div>
    </>
  );
};

export default Transactions;
