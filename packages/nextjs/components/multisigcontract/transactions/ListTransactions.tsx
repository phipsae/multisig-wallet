import { useEffect, useState } from "react";
import { NotficationsConfirmError } from "../NotficationsConfirmError";
import { ethers } from "ethers";
import { useContractRead, useContractWrite } from "wagmi";
import { CheckIcon, PaperAirplaneIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

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
    isError: isErrorConfirmTransaction,
    isLoading: isLoadingConfirmTransaction,
    isSuccess: isSuccesConfirmTransaction,
    write: confirmTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "confirmTransaction",
  });

  const {
    isError: isErrorRevoke,
    isLoading: isLoadingRevoke,
    isSuccess: isSuccessRevoke,
    write: revokeConfirmation,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "revokeConfirmation",
  });

  const {
    isError: isErrorExecute,
    isLoading: isLoadingExecute,
    isSuccess: isSuccessExecute,
    write: executeTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWalletInfo?.abi,
    functionName: "executeTransaction",
  });

  const {
    data: deleteData,
    isError: isErrorDelete,
    isLoading: deleteLoading,
    isSuccess: isSuccessDelete,
    write: deleteTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
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

  useEffect(() => {
    if (isSuccesConfirmTransaction || isSuccessRevoke) {
      refetchGetTransactions();
    }
  });
  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && (isSuccesConfirmTransaction || isErrorConfirmTransaction)) {
  //     if (isSuccesConfirmTransaction) {
  //       console.log("CONFIRMED!!!!!!!!");
  //       notification.success("Confirmation successfully set");
  //       refetchGetTransactions();
  //     }
  //     if (isErrorConfirmTransaction) {
  //       console.log("ERROR revoke!!!!!!!!");
  //       // setActionType("confirmTransaction");
  //       notification.error("Transaction already confirmed");
  //       refetchGetTransactions();
  //     }
  //   }
  // }, [isSuccesConfirmTransaction, multiSigWalletInfo?.abi, isErrorConfirmTransaction, refetchGetTransactions]);

  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && isSuccesConfirmTransaction) {
  //     console.log("CONFIRMED!!!!!!!!");
  //     notification.success("Confirmation successfully set");
  //     refetchGetTransactions();
  //   }
  // }, [isSuccesConfirmTransaction, multiSigWalletInfo?.abi, refetchGetTransactions]);

  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && isSuccessRevoke) {
  //     console.log("CONFIRMED Revoke!!!!!!!!");
  //     // setActionType("confirmTransaction");
  //     notification.error("Confirmation successfully revoked");
  //     refetchGetTransactions();
  //   }
  // }, [isSuccessRevoke, multiSigWalletInfo?.abi, refetchGetTransactions]);

  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && (isSuccessRevoke || errorRevoke)) {
  //     if (isSuccessRevoke) {
  //       console.log("CONFIRMED revoke!!!!!!!!");
  //       // setActionType("confirmTransaction");
  //       notification.error("Confirmation successfully revoked");
  //       refetchGetTransactions();
  //     }
  //     if (errorRevoke) {
  //       console.log("ERROR revoke!!!!!!!!");
  //       // setActionType("confirmTransaction");
  //       notification.error("Transaction not confirmed yet");
  //       refetchGetTransactions();
  //     }
  //   }
  // }, [isSuccessRevoke, multiSigWalletInfo?.abi, errorRevoke, refetchGetTransactions]);

  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && isSuccessExecute) {
  //     console.log("CONFIRMED sent!!!!!!!!");
  //     // setActionType("confirmTransaction");
  //     notification.success("Tansaction successfully sent", {
  //       icon: "🎉",
  //     });
  //     refetchGetTransactions();
  //   }
  // }, [isSuccessExecute, multiSigWalletInfo?.abi, refetchGetTransactions]);

  // useEffect(() => {
  //   if (multiSigWalletInfo?.abi && (deleteSuccess || errorDelete)) {
  //     if (deleteSuccess) {
  //       console.log("CONFIRMED Delete!!!!!!!!");
  //       // setActionType("confirmTransaction");
  //       notification.error("Tansaction successfully deleted");
  //       refetchGetTransactions();
  //     }
  //     if (errorDelete) {
  //       console.log("ERROR Delete!!!!!!!!");
  //       // setActionType("confirmTransaction");
  //       notification.error("Tansaction successfully deleted");
  //       refetchGetTransactions();
  //     }
  //   }
  // }, [deleteSuccess, multiSigWalletInfo?.abi, errorDelete, refetchGetTransactions]);

  return (
    <>
      <NotficationsConfirmError
        isError={isErrorConfirmTransaction}
        isSuccess={isSuccesConfirmTransaction}
        errorMessage="Transaction already confirmed"
        successMessage="Confirmation successfully set"
      />
      <NotficationsConfirmError
        isError={isErrorRevoke}
        isSuccess={isSuccessRevoke}
        errorMessage="Transaction not yet confirmed"
        successMessage="Confirmation successfully revoked"
      />
      <NotficationsConfirmError
        isError={isErrorExecute}
        isSuccess={isSuccessExecute}
        errorMessage="Transaction not sent"
        successMessage="Transaction successfully sent"
      />
      <NotficationsConfirmError
        isError={isErrorDelete}
        isSuccess={isSuccessDelete}
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
                            {isLoadingConfirmTransaction ? (
                              <span className="loading loading-spinner text-primary"></span>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            // disabled={!revokeConfirmation}
                            onClick={() =>
                              revokeConfirmation({
                                args: [BigInt(index)],
                              })
                            }
                          >
                            {isLoadingRevoke ? (
                              <span className="loading loading-spinner text-primary"></span>
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
                            {isLoadingExecute ? (
                              <span className="loading loading-spinner text-primary"></span>
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
                            {deleteLoading ? (
                              <span className="loading loading-spinner text-primary"></span>
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
