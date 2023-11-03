import { useEffect, useState } from "react";
import { AddressInput, EtherInput } from "../../scaffold-eth";
import { ethers } from "ethers";
import { useContractRead, useContractWrite } from "wagmi";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

export const SubmitTransaction = (multiSigWalletAddress: any) => {
  const [to, setTo] = useState("");

  const [amount, setAmount] = useState("");

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const { refetch: refetchGetTransactions } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "getTransactions",
  });
  const {
    isLoading: isLoadingSumbitTransaction,
    isSuccess: isSuccessSubmitTransaction,
    data: submitTransactionData,
    write: submitTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "submitTransaction",
    onSettled(data, error) {
      console.log("Settled", { data, error });
    },
    onSuccess(data) {
      console.log("Success", data);
      refetchGetTransactions();
    },
  });

  const onSubmit1 = async () => {
    const tx = await submitTransaction({ args: [to, ethers.parseEther(amount), "0x0"] });
    console.log("Log TX", await tx);
    // if (tx) {
    //   const txHash = tx.data.hash; // Here you get the transaction hash
    //   console.log(`Transaction sent with hash: ${txHash}`);

    //   try {
    //     // Wait for the transaction to be confirmed
    //     const receipt = await tx.data.wait(1); // wait for 1 confirmation by default
    //     console.log("Transaction confirmed with receipt:", receipt);
    //   } catch (error) {
    //     console.error("Error waiting for transaction confirmation:", error);
    //   }
    // }
  };

  useEffect(() => {
    if (submitTransactionData) {
      // Perform any necessary actions on success
      console.log(submitTransactionData.hash, "Transaction successful!");
      // For example, you might want to refetch data or redirect to another page
      // ... (your code for handling success)
      notification.success("Transaction successfully submitted");
      refetchGetTransactions();
    }
    if (isLoadingSumbitTransaction) {
      // Show the spinner when loading
      console.log("isLoading");
    }
  }, [isLoadingSumbitTransaction, submitTransactionData, refetchGetTransactions]);

  return (
    <>
      <div className="flex flex-col">
        <div className="text-center mb-4">
          <span className="block text-1xl font-bold"> ✉️ Submit a new Transaction</span>
        </div>

        <div className="flex flex-col gap-4 mb-4 justify-center items-center">
          <div className="flex flex-row">
            <span className="w-7/8">
              <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
            </span>
            <span className="w-[150px] mx-5">
              <EtherInput value={amount} onChange={amount => setAmount(amount)} placeholder="Amount" />
            </span>
          </div>
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto"
            onClick={() => {
              onSubmit1();
              // submitTransaction({
              //   args: [to, ethers.parseEther(amount), "0x0"],
              // });
            }}
          >
            <EnvelopeIcon className="h-4 w-4" /> Submit
          </button>
        </div>
      </div>
    </>
  );
};
