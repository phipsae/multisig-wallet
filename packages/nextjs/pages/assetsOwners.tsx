import React from "react";
import type { NextPage } from "next";
import { AddOwners } from "~~/components/multisigcontract/AddOwners";
import { FundContract } from "~~/components/multisigcontract/FundContract";
import { MultiSigWalletOverview } from "~~/components/multisigcontract/MultiSigWalletOverview";
import { ShowOwnersRemove } from "~~/components/multisigcontract/ShowOwnersRemove";

const AssetsOwners: NextPage = () => {
  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        <div className="flex justify-center mt-5">
          <MultiSigWalletOverview />
        </div>
        <div className="flex justify-center mt-5">
          <FundContract />
        </div>
        <div className="flex justify-center">
          <ShowOwnersRemove />
        </div>
        <div className="flex justify-center mt-5">
          <AddOwners />
        </div>
      </div>
    </>
  );
};

export default AssetsOwners;
