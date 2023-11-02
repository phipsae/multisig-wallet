import * as React from "react";
import { AddressInput, EtherInput } from "../scaffold-eth";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { useContractWrite } from "wagmi";
import { useScaffoldContract, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

export const SubmitTransaction = (multiSigWalletAddress: any) => {
  const [to, setTo] = React.useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState("");
  // const [debouncedAmount] = useDebounce(amount, 500);

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const {
    data,
    isLoading,
    isSuccess,
    write: submitTransaction,
  } = useContractWrite({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "submitTransaction",
  });

  // const {
  //   writeAsync: submitTransaction,
  //   isLoading,
  //   isMining,
  // } = useScaffoldContractWrite({
  //   contractName: "MultiSigWallet",
  //   functionName: "submitTransaction",
  //   args: [to, NUMBER_REGEX.test(amount) ? ethers.parseEther(amount) : undefined, "0x0"],
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  return (
    <>
      <div className="flex flex-col">
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Create Transaction</span>
        </div>

        <div className="flex flex-col gap-4 mb-4 justify-center items-center">
          <span className="w-7/8">
            <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
          </span>
          <span className="w-5/6">
            <EtherInput value={amount} onChange={amount => setAmount(amount)} placeholder="Amount" />
          </span>
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto"
            onClick={() => {
              submitTransaction({
                args: [to, ethers.parseEther(amount), "0x0"],
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
};
