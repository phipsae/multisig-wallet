import * as React from "react";
import { EtherInput } from "../scaffold-eth";
import { fetchBalance, getAccount } from "@wagmi/core";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

export function FundContract(multiSigWalletAddress: any) {
  const to = multiSigWalletAddress.multiSigWalletAddress;
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sender = await getAccount();
    const balance = await fetchBalance({
      address: String(sender.address),
    });
    if (amount == "") {
      notification.error("Please insert the amount of ETH you want to spend");
      return;
    } else if (balance.formatted < amount) {
      notification.error("Not enough ETH in wallet");
      return;
      // } else if (!NUMBER_REGEX.test(amount)) {
      //   notification.error("Please insert the amount of ETH you want to spend");
      //   return;
    } else {
      sendTransaction?.();
    }
  };

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    // value: isValidAmount ? ethers.parseEther(amount) : undefined,
    value: NUMBER_REGEX.test(amount) ? ethers.parseEther(amount) : undefined,
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const [transactionSubmitted, setTransactionSubmitted] = React.useState(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isLoading && !transactionSubmitted) {
      notification.info("Transaction submitted and now waiting for confirmation...", {
        icon: "🕡",
        duration: 13000,
      });
      setTransactionSubmitted(true);
    }
  }, [isLoading, transactionSubmitted]);

  React.useEffect(() => {
    if (isSuccess && !transactionSuccess) {
      notification.success("Transaction successfully sent", {
        icon: "🎉",
      });
      setTransactionSuccess(true);
    }
  }, [isSuccess, transactionSuccess]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex mb-4 justify-center items-center">
          <h2>Fund the contract with Ether</h2>
        </div>
        <div className="flex mb-4 justify-center items-center">
          <span className="w-1/2">
            <EtherInput value={amount} onChange={amount => setAmount(amount)} name="eth" />
          </span>
          <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mx-2" onClick={handleSubmit}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
