import React from "react";
import { useEffect, useState } from "react";
import { AddressInput } from "../scaffold-eth";
import { useContractWrite } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

export const AddOwners = (multiSigWalletAddress: any) => {
  const [newAddress, setNewAddress] = useState<string>("");

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const {
    data,
    isLoading,
    isSuccess,
    write: addOwner,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "addOwner",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Do something with the input value, e.g., submit it to an API
    addOwner({ args: [newAddress] });
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
