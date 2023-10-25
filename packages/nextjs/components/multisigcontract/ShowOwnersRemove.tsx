import { useState } from "react";
import multiSigFactoryABI from "../../0_abi/multi_sig_factory_abi";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

export const ShowOwnersRemove = () => {
  const { data: owners } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "getOwners",
  });

  const { data: confirmationsRequired } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "numConfirmationsRequired",
  });

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  // WAGMI: contract write
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: multiSigWallet?.address,
    abi: multiSigWallet?.abi,
    functionName: "removeOwner",
  });

  return (
    <>
      {
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">
              Multi Sig Owner List - required Signatures: {Number(confirmationsRequired)}
            </span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Address Owner</th>
                  <th className="bg-primary">Remove</th>
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
                        <td className="text-center">
                          <button
                            disabled={!write}
                            onClick={() =>
                              write({
                                args: [owner],
                              })
                            }
                          >
                            Remove
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
