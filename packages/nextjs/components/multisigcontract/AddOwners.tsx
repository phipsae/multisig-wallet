import React from "react";
import { useEffect, useState } from "react";
import { AddressInput } from "../scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const AddOwners = () => {
  const [newAddress, setNewAddress] = useState<string>("");

  const {
    writeAsync: addOwner,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "MultiSigWallet",
    functionName: "addOwner",
    args: [newAddress],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Do something with the input value, e.g., submit it to an API
    addOwner();
    console.log("Input value submitted:", newAddress);
  };

  return (
    <>
      <div className="flex flex-row mb-4 ">
        <span className="">
          <h2>Enter address you want to add:</h2>
          <AddressInput
            placeholder="Address.."
            aria-label="Adress"
            value={newAddress}
            onChange={newAddress => setNewAddress(newAddress)}
          />
        </span>
        <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </>
  );
};
