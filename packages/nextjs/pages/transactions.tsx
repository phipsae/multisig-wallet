import React from "react";
import type { NextPage } from "next";
import { ListTransactions } from "~~/components/multisigcontract/ListTransactions";
import { SubmitTransaction } from "~~/components/multisigcontract/SubmitTransaction";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";

const Transactions: NextPage = () => {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });
  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        <div className="flex justify-center mt-5">
          <ListTransactions />
        </div>
        <div className="flex justify-center mt-5">
          <SubmitTransaction />
        </div>
      </div>
    </>
  );
};

export default Transactions;
