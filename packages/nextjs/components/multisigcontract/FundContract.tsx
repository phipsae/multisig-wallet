import * as React from "react";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export function FundContract() {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  const to = multiSigWallet?.address;
  // const [to, setTo] = React.useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? ethers.parseEther(debouncedAmount) : undefined,
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        sendTransaction?.();
      }}
    >
      <h2>Fund the contract with Ether</h2>
      <input aria-label="Amount (ether)" onChange={e => setAmount(e.target.value)} placeholder="0.05" value={amount} />
      <button disabled={isLoading || !sendTransaction || !to || !amount}>{isLoading ? "Sending..." : "Send"}</button>
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </form>
  );
}
