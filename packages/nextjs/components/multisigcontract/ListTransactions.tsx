import * as React from "react";
import { ethers } from "ethers";
import { useContractRead, useContractWrite } from "wagmi";
import { CheckIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export function ListTransactions() {
  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  const { data: confirmationsRequired } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "numConfirmationsRequired",
  });

  const { data: getTransactions } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "getTransactions",
  });

  // WAGMI: contract write
  const {
    data,
    isLoading,
    isSuccess: isConfirmed,
    write: confirmTransaction,
  } = useContractWrite({
    address: multiSigWalletInfo?.address,
    abi: multiSigWalletInfo?.abi,
    functionName: "confirmTransaction",
  });

  const {
    data: revokeData,
    isLoading: isLoadingRevoke,
    isSuccess: isSuccessRevoke,
    write: revokeConfirmation,
  } = useContractWrite({
    address: multiSigWalletInfo?.address,
    abi: multiSigWalletInfo?.abi,
    functionName: "revokeConfirmation",
  });

  const {
    data: executeData,
    isLoading: isLoadingExecute,
    isSuccess: isSuccessExecute,
    write: executeTransaction,
  } = useContractWrite({
    address: multiSigWalletInfo?.address,
    abi: multiSigWalletInfo?.abi,
    functionName: "executeTransaction",
  });

  const {
    data: deleteData,
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    write: deleteTransaction,
  } = useContractWrite({
    address: multiSigWalletInfo?.address,
    abi: multiSigWalletInfo?.abi,
    functionName: "deleteTransaction",
  });

  const nonExecutedTransactions = () => {
    let counter = 0;
    getTransactions?.map(tx => {
      if (tx.executed == false) {
        counter += 1;
      }
    });
    if (counter == 0) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="mt-8">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">
            Transaction List - required Confirmations: {Number(confirmationsRequired)}
          </span>
        </div>
        <div className="overflow-x-auto shadow-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="bg-primary">Receiver Address</th>
                <th className="bg-primary">Value</th>
                <th className="bg-primary">Confirmations</th>
                <th className="bg-primary">Give Confirmation</th>
                <th className="bg-primary">Revoke Confirmation</th>
                <th className="bg-primary">Execute Transaction</th>
                <th className="bg-primary">Delete Transaction</th>
              </tr>
            </thead>
            <tbody>
              {!getTransactions || getTransactions.length === 0 || !nonExecutedTransactions() ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No open transactions yet
                  </td>
                </tr>
              ) : (
                getTransactions?.map((tx, index) => {
                  if (tx.executed == false) {
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          <Address address={tx.to} />
                        </td>
                        <td className="text-center">{ethers.formatEther(tx.value)}</td>
                        <td className="text-center">{Number(tx.numConfirmations)}</td>
                        <td className="text-center">
                          <button
                            disabled={!confirmTransaction}
                            onClick={() =>
                              confirmTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            disabled={!revokeConfirmation}
                            onClick={() =>
                              revokeConfirmation({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            hidden={tx.numConfirmations < Number(confirmationsRequired)}
                            disabled={!executeTransaction}
                            onClick={() =>
                              executeTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            <PaperAirplaneIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            disabled={!deleteTransaction}
                            onClick={() =>
                              deleteTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
