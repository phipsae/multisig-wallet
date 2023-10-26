import * as React from "react";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { useContractRead, useContractWrite } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

export function ListTransactions() {
  const [txId, setTxId] = React.useState(0);

  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  const { data: transactionCount } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "getTransactionCount",
  });

  const { data: confirmationsRequired } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "numConfirmationsRequired",
  });

  //   const { data: getTransaction } = useScaffoldContractRead({
  //     contractName: "MultiSigWallet",
  //     functionName: "getTransaction",
  //     args: [BigInt(txId)],
  //   });

  const { data: getTransactions } = useScaffoldContractRead({
    contractName: "MultiSigWallet",
    functionName: "getTransactions",
  });

  // WAGMI: contract write
  const {
    data,
    isLoading,
    isSuccess,
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

  return (
    <>
      <div className="mt-8">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">
            Transaction List - required Signatures: {Number(confirmationsRequired)}
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
              </tr>
            </thead>
            <tbody>
              {!getTransactions || getTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No owners added yet
                  </td>
                </tr>
              ) : (
                getTransactions?.map((tx, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        <Address address={tx.to} />
                      </td>
                      <td className="text-center">{Number(tx.value)}</td>
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
                          Give Confirmation
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
                          Revoke Confirmation
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          disabled={!executeTransaction}
                          onClick={() =>
                            executeTransaction({
                              args: [BigInt(index)],
                            })
                          }
                        >
                          Execute Transaction
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
    </>
  );
}
