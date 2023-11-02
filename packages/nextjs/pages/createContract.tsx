import { useEffect, useState } from "react";
import { useSharedState } from "../sharedStateContext";
import { getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { AccountConnectButton } from "~~/components/multisigcontract/AccountConnectButton";
import { ContractList } from "~~/components/multisigcontract/createContract/ContractList";
import { CreateNewContract } from "~~/components/multisigcontract/createContract/createNewContract";

const CreateContract: NextPage = () => {
  // use shared state --> see
  const { walletConnected, setWalletConnected } = useSharedState();
  const { myAddress, setMyAddress } = useSharedState();
  // const { multiSigWalletAddress, setMultiSigWalletAddress } = useSharedState();

  useEffect(() => {
    if (walletConnected) {
      setMyAddress(getAccount().address?.toString() || "");
      console.log("from UseEffect, ", myAddress);
      if (myAddress != "") {
        setWalletConnected(true);
      }
    } else {
      setMyAddress("");
    }
  }, [myAddress]);

  return (
    <>
      <div className="container mx-auto flex flex-col mt-10">
        {!walletConnected ? (
          <AccountConnectButton walletConnect={true} address={getAccount().address?.toString() || ""} />
        ) : (
          <div>
            <div className="flex justify-center mt-5">
              <div className="text-center mb-4 mt-5">
                <span className="block text-2xl font-bold">Create a new MultiSig Wallet </span>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <CreateNewContract />
            </div>
            <div className="flex justify-center mt-5">
              <div className="text-center mb-4 mt-5">
                <span className="block text-2xl font-bold">Your Multi Sig Wallets </span>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <ContractList myAddress={myAddress} />
            </div>
          </div>
        )}
        {walletConnected && <AccountConnectButton walletConnect={false} address={""} />}
      </div>
    </>
  );
};

export default CreateContract;
