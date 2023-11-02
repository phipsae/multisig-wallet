import React from "react";
import { useEffect, useState } from "react";
import { AddressInput } from "../scaffold-eth";
import { Spinner } from "react-bootstrap/Spinner";
import { useContractRead, useContractWrite } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const AddOwners = (multiSigWalletAddress: any) => {
  const [newAddress, setNewAddress] = useState<string>("");

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  // add refetch here :)

  const {
    data: owners,
    isError: ownersError,
    isLoading: ownersLoading,
    isSuccess: isSuccessGetOwners,
    refetch: refetchGetOwners,
  } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "getOwners",
  });

  const {
    data: dataAddOwner,
    isLoading,
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
    // Do something with the input value, e.g., submit it to an API
    addOwner({ args: [newAddress] });
    console.log("Input value submitted:", newAddress);
  };

  useEffect(() => {
    // console.log("RemoveOwner from Effect: ", removeOwner);
    // console.log(multiSigWallet?.abi);
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
  }, [isSuccessGetOwners, isSuccessAddOwner, refetchGetOwners, multiSigWallet?.abi, isErrorAddOwner, dataAddOwner]);

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
        {/* <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2" onClick={handleSubmit}>
          Send
        </button> */}
        <button
          className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            // <div className="border" role="status">
            //   <span className="sr-only">Loading...</span>
            // </div>
            "Add Signer"
          )}
        </button>
      </div>
    </>
  );
};
