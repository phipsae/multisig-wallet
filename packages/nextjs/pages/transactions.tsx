import React from "react";
import type { NextPage } from "next";
import { ListTransactions } from "~~/components/multisigcontract/ListTransactions";
import { SubmitTransaction } from "~~/components/multisigcontract/SubmitTransaction";
import { Address, Balance, ContractInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";

const Transactions: NextPage = () => {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });
  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  return (
    <>
      <div>
        <ListTransactions />
        <SubmitTransaction />
      </div>
    </>
  );
};

export default Transactions;
