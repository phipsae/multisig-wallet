import React from "react";
import type { NextPage } from "next";
import { AddOwners } from "~~/components/multisigcontract/AddOwners";
import { FundContract } from "~~/components/multisigcontract/FundContract";
import { ShowOwnersRemove } from "~~/components/multisigcontract/ShowOwnersRemove";
import { Address, Balance, ContractInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";

const AssetsOwners: NextPage = () => {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });
  const { data: MultiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  return (
    <>
      <h1> Assets & Owners </h1>
      <button
        onClick={() => {
          console.log(multiSigWallet);
        }}
      >
        {" "}
        Click Me for Info
      </button>
      <div>
        <p>Multi Sig Wallet Address: {multiSigWallet?.address}</p>
        <p>Multi Sig Wallet Balance: </p>
        <Balance className="text-xl" address={MultiSigWalletInfo?.address} />
      </div>
      <FundContract />
      <ShowOwnersRemove />
      <AddOwners />
    </>
  );
};

export default AssetsOwners;
