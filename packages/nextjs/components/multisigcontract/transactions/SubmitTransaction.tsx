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
    write: submitTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "submitTransaction",
  });

  useEffect(() => {
    if (isSuccessSubmitTransaction) {
      // Perform any necessary actions on success
      console.log("Transaction successful!");
      // For example, you might want to refetch data or redirect to another page
      // ... (your code for handling success)
      notification.success("Transaction successfully submitted");
      refetchGetTransactions();
    }
    if (isLoadingSumbitTransaction) {
      // Show the spinner when loading
      console.log("isLoading");
    }
  }, [isLoadingSumbitTransaction, isSuccessSubmitTransaction, refetchGetTransactions]);

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
              submitTransaction({
                args: [to, ethers.parseEther(amount), "0x0"],
              });
            }}
          >
            <EnvelopeIcon className="h-4 w-4" /> Submit
          </button>
        </div>
      </div>
    </>
  );
};
