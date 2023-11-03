import React from "react";
import { useEffect, useState } from "react";
import { AddressInput } from "../../scaffold-eth";
import { useContractRead, useContractWrite } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const AddOwners = (multiSigWalletAddress: any) => {
  const [newAddress, setNewAddress] = useState<string>("");

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const { refetch: refetchGetOwners } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "getOwners",
  });

  const {
    isLoading: isLoadingAddOwner,
    isSuccess: isSuccessAddOwner,
    isError: isErrorAddOwner,
    error: errorAddOwner,
    write: addOwner,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "addOwner",
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addOwner({ args: [newAddress] });
    console.log("Input value submitted:", newAddress);
  };

  useEffect(() => {
    if (multiSigWallet?.abi && isSuccessAddOwner) {
      console.log("Transaction successful!");
      notification.success("Signer successfully added", {
        icon: "🎉",
      });
      refetchGetOwners();
    }
    if (multiSigWallet?.abi && isErrorAddOwner) {
      console.log(errorAddOwner);
      notification.error("Signer already added");
      refetchGetOwners();
    }
  }, [isSuccessAddOwner, refetchGetOwners, multiSigWallet?.abi, isErrorAddOwner, errorAddOwner]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row mb-4 ">
          <span className="">
            <AddressInput
              placeholder="Address.."
              aria-label="Adress"
              value={newAddress}
              onChange={newAddress => setNewAddress(newAddress)}
            />
          </span>
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
            onClick={handleSubmit}
            disabled={isLoadingAddOwner}
          >
            {isLoadingAddOwner ? <span className="loading loading-spinner text-primary"></span> : "Add Signer"}
          </button>
        </div>
        <div className="text-center">
          <span>Enter address you want to add as a signer</span>
        </div>
      </div>
    </>
  );
};
