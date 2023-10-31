import React from "react";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";

export const MultiSigWalletOverview = () => {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
    address: "0xdA499DBA956F590f658D52ED4d1020f33469BbD0",
  });
  const { data: MultiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  return (
    <>
      <div>
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Assets & Owners</span>
        </div>
        <div>
          Multi Sig Wallet Address: <Address address={multiSigWallet?.address} />
        </div>
        <div className="mt-5">
          Multi Sig Wallet Balance: <Balance className="text-xl" address={MultiSigWalletInfo?.address} />
        </div>
      </div>
    </>
  );
};
