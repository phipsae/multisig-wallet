import { useEffect } from "react";
import { NotficationsConfirmError } from "../NotficationsConfirmError";
import { ethers } from "ethers";
import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { CheckIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Spinner } from "~~/components/assets/Spinner";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export const ListTransactions = (multiSigWalletAddress: any) => {
  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  const { data: confirmationsRequired } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "numConfirmationsRequired",
  });

  const { data: getTransactions, refetch: refetchGetTransactions } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "getTransactions",
  });

  const {
    data: dataConfirmTransaction,
    isError: isErrorConfirmTransaction,
    write: confirmTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "confirmTransaction",
  });

  const { isLoading: isLoadingConfirmTransactionWait, isSuccess: isSuccesConfirmTransactionWait } =
    useWaitForTransaction({
      hash: dataConfirmTransaction?.hash,
    });

  const {
    data: dataRevokeConfirmation,
    isError: isErrorRevoke,
    write: revokeConfirmation,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "revokeConfirmation",
  });

  const { isLoading: isLoadingRevokeWait, isSuccess: isSuccessRevokeWait } = useWaitForTransaction({
    hash: dataRevokeConfirmation?.hash,
  });

  const {
    data: dataExecuteTransaction,
    isError: isErrorExecute,
    isLoading: isLoadingExecute,
    isSuccess: isSuccessExecute,
    write: executeTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "executeTransaction",
  });

  const { isLoading: isLoadingExecuteWait, isSuccess: isSuccessExecuteWait } = useWaitForTransaction({
    hash: dataExecuteTransaction?.hash,
  });

  const {
    data: dataDelete,
    isError: isErrorDelete,
    isLoading: deleteLoading,
    isSuccess: isSuccessDelete,
    write: deleteTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "deleteTransaction",
  });

  const { isLoading: isDeleteLoadingWait, isSuccess: isSuccessDeleteWait } = useWaitForTransaction({
    hash: dataDelete?.hash,
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

  useEffect(() => {
    if (isSuccesConfirmTransactionWait || isSuccessRevokeWait || isSuccessDeleteWait || isSuccessExecuteWait) {
      refetchGetTransactions();
    }
  }, [
    isSuccesConfirmTransactionWait,
    isSuccessRevokeWait,
    isSuccessExecuteWait,
    isSuccessDeleteWait,
    refetchGetTransactions,
  ]);

  return (
    <>
      <NotficationsConfirmError
        isError={isErrorConfirmTransaction}
        isSuccess={isSuccesConfirmTransactionWait}
        errorMessage="Transaction already confirmed"
        successMessage="Confirmation successfully set"
      />
      <NotficationsConfirmError
        isError={isErrorRevoke}
        isSuccess={isSuccessRevokeWait}
        errorMessage="Transaction not yet confirmed"
        successMessage="Confirmation successfully revoked"
      />
      <NotficationsConfirmError
        isError={isErrorExecute}
        isSuccess={isSuccessExecuteWait}
        successMessage="Transaction successfully sent"
        errorMessage="Not enough confirmations"
      />
      <NotficationsConfirmError
        isError={isErrorDelete}
        isSuccess={isSuccessDeleteWait}
        successMessage="Transaction successfully deleted"
        errorMessage="Transaction couldn't be deleted"
      />
      <div className="mt-8">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">📃 Transactions List</span>
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
                        <td className="text-center">
                          {Number(tx.numConfirmations)}/{Number(confirmationsRequired)}
                        </td>
                        <td className="text-center">
                          <button
                            disabled={!confirmTransaction}
                            onClick={() =>
                              confirmTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            {isLoadingConfirmTransactionWait ? (
                              <div className="flex  justify-center">
                                <Spinner width="" height=""></Spinner>
                              </div>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            disabled={isLoadingConfirmTransactionWait}
                            onClick={() =>
                              revokeConfirmation({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            {isLoadingRevokeWait ? (
                              <div className="flex  justify-center">
                                <Spinner width="" height=""></Spinner>
                              </div>
                            ) : (
                              <XMarkIcon className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            hidden={tx.numConfirmations < Number(confirmationsRequired)}
                            // disabled={!executeTransaction}
                            onClick={() =>
                              executeTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            {isLoadingExecuteWait ? (
                              <div className="flex  justify-center">
                                <Spinner width="" height=""></Spinner>
                              </div>
                            ) : (
                              <PaperAirplaneIcon className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            // disabled={!deleteTransaction}
                            onClick={() =>
                              deleteTransaction({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            {isDeleteLoadingWait ? (
                              <div className="flex  justify-center">
                                <Spinner width="" height=""></Spinner>
                              </div>
                            ) : (
                              <TrashIcon className="h-4 w-4" />
                            )}
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
};
