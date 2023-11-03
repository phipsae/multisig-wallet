import { useEffect, useState } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const ShowOwnersRemove = (multiSigWalletAddress: any) => {
  const [OwnerBeRemoved, setOwnerBeRemoved] = useState("");

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const {
    data: owners,
    isSuccess: isSuccessGetOwners,
    refetch: refetchGetOwners,
  } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "getOwners",
  });

  const { data: creator } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "creator",
  });

  const {
    isLoading: isLoadingRemoveOwner,
    isSuccess: isSuccessremoveOwner,
    write: removeOwner,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "removeOwner",
  });

  useEffect(() => {
    if (multiSigWallet?.abi && isSuccessremoveOwner) {
      console.log("Transaction successful!");
      notification.success("Signer successfully removed");
      refetchGetOwners();
    }
  }, [isSuccessGetOwners, isSuccessremoveOwner, refetchGetOwners, multiSigWallet?.abi]);

  return (
    <>
      {
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">Multi Sig Signer List</span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Signer Address</th>
                  <th className="bg-primary">Remove</th>
                  <th className="bg-primary">Confirm</th>
                </tr>
              </thead>
              <tbody>
                {!owners || owners.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No signers added yet
                    </td>
                  </tr>
                ) : (
                  owners?.map((owner, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          <Address address={owner} />
                        </td>
                        <td className="text-left">
                          <button
                            // disabled={!write}
                            hidden={creator == owner}
                            disabled={!removeOwner}
                            onClick={() => {
                              setOwnerBeRemoved(owner);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="text-left">
                          <button
                            // disabled={!write}
                            hidden={OwnerBeRemoved != owner || creator == owner}
                            disabled={!removeOwner}
                            onClick={() => {
                              OwnerBeRemoved != "" && removeOwner({ args: [OwnerBeRemoved] });
                            }}
                          >
                            {isLoadingRemoveOwner ? (
                              <span className="loading loading-spinner text-primary"></span>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                          {isLoadingRemoveOwner ? (
                            ""
                          ) : (
                            <button
                              hidden={OwnerBeRemoved != owner || creator == owner}
                              disabled={!removeOwner}
                              onClick={() => {
                                setOwnerBeRemoved("");
                              }}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      }
      <br />
    </>
  );
};
