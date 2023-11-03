import * as React from "react";
import { EtherInput } from "../../scaffold-eth";
import { fetchBalance, getAccount } from "@wagmi/core";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
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
    } else {
      sendTransaction?.();
    }
  };

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    // value: isValidAmount ? ethers.parseEther(amount) : undefined,
    value: NUMBER_REGEX.test(amount) ? ethers.parseEther(amount) : undefined,
  });

  const {
    data,
    sendTransaction,
    isLoading: isLoadingSendTransaction,
    isSuccess: isSuccessSendTransaction,
  } = useSendTransaction(config);

  const {} = useWaitForTransaction({
    hash: data?.hash,
  });

  React.useEffect(() => {
    if (isSuccessSendTransaction) {
      notification.success("Transaction successfully sent to Multi Sig Wallet", {
        icon: "🎉",
      });
    }
  }, [isSuccessSendTransaction]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex mb-4 justify-center items-center">
          <span className="w-[150px]">
            <EtherInput value={amount} onChange={amount => setAmount(amount)} name="eth" />
          </span>
          <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mx-2" onClick={handleSubmit}>
            {isLoadingSendTransaction ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : (
              <BanknotesIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="flex mb-4 justify-center items-center">
          <span>Fund the contract with Ether</span>
        </div>
      </div>
    </>
  );
}
