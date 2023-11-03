import React from "react";
import { useEffect, useState } from "react";
import { AddressInput } from "../../scaffold-eth";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { Spinner } from "~~/components/assets/Spinner";
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
    data: dataAddOwner,
    isError: isErrorAddOwner,
    write: addOwner,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "addOwner",
  });

  const { isLoading: isLoadingAddOwnerWait, isSuccess: isSuccessAddOwnerWait } = useWaitForTransaction({
    hash: dataAddOwner?.hash,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addOwner({ args: [newAddress] });
    console.log("Input value submitted:", newAddress);
  };

  useEffect(() => {
    if (multiSigWallet?.abi && isSuccessAddOwnerWait) {
      notification.success("Signer successfully added", {
        icon: "🎉",
      });
      refetchGetOwners();
    }
    if (multiSigWallet?.abi && isLoadingAddOwnerWait) {
      notification.success("Waiting for transaction confirmation", { icon: "⏱️" });
    }
    if (multiSigWallet?.abi && isErrorAddOwner) {
      notification.error("Signer already added");
      refetchGetOwners();
    }
  }, [isSuccessAddOwnerWait, refetchGetOwners, multiSigWallet?.abi, isErrorAddOwner, isLoadingAddOwnerWait]);

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
            disabled={isLoadingAddOwnerWait}
          >
            {isLoadingAddOwnerWait ? (
              <div className="flex w-[100px] justify-center">
                <Spinner width="100" height="100"></Spinner>
              </div>
            ) : (
              "Add Signer"
            )}
          </button>
        </div>
        <div className="text-center">
          <span>Enter address you want to add as a signer</span>
        </div>
      </div>
    </>
  );
};
