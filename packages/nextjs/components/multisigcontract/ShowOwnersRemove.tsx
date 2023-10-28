import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PopUp } from "~~/components/multisigcontract/PopUp";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const ShowOwnersRemove = () => {
  const [removeOwner, setRemoveOwner] = useState("");

  useEffect(() => {
    console.log("RemoveOwner from Effect: ", removeOwner);
  }, [removeOwner]);

  const { data: owners } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "getOwners",
  });

  const { data: creator } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "creator",
  });

  const { data: confirmationsRequired } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "numConfirmationsRequired",
  });

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  // WAGMI: contract write
  // const { data, isLoading, isSuccess, write } = useContractWrite({
  //   address: multiSigWallet?.address,
  //   abi: multiSigWallet?.abi,
  //   functionName: "removeOwner",
  // });

  const {
    writeAsync: removeOwners,
    isLoading: rO,
    isMining: rOM,
  } = useScaffoldContractWrite({
    contractName: "MultiSigWallet",
    functionName: "removeOwner",
    args: [removeOwner],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      {
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">
              Multi Sig Owner List - required Confirmations: {Number(confirmationsRequired)}
            </span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Address Owner</th>
                  <th className="bg-primary">Remove</th>
                  <th className="bg-primary">Confirm</th>
                </tr>
              </thead>
              <tbody>
                {!owners || owners.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No owners added yet
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
                            disabled={!removeOwners}
                            onClick={() => {
                              console.log("RemoveOwner first from Button: ", removeOwner);
                              console.log("Owner from Button: ", owner);
                              setRemoveOwner(owner);
                              console.log("RemoveOwner from Button: ", removeOwner);
                              // removeOwner != "" && removeOwners();
                              // write({
                              //   args: [owner],
                              // });
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="text-left">
                          <button
                            // disabled={!write}
                            hidden={removeOwner != owner || creator == owner}
                            disabled={!removeOwners}
                            onClick={() => {
                              removeOwner != "" && removeOwners();
                              // write({
                              //   args: [owner],
                              // });
                            }}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            // disabled={!write}
                            hidden={removeOwner != owner || creator == owner}
                            disabled={!removeOwners}
                            onClick={() => {
                              setRemoveOwner("");
                              // write({
                              //   args: [owner],
                              // });
                            }}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
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
