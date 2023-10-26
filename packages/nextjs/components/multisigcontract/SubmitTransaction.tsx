import * as React from "react";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";
import { useContractWrite } from "wagmi";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

export function SubmitTransaction() {
  const [to, setTo] = React.useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });

  // WAGMI: contract write
  const {
    data,
    isLoading,
    isSuccess,
    write: submitTransaction,
  } = useContractWrite({
    address: multiSigWallet?.address,
    abi: multiSigWallet?.abi,
    functionName: "submitTransaction",
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        submitTransaction({
          args: [debouncedTo, ethers.parseEther(debouncedAmount), "0x"],
        });
      }}
    >
      <input aria-label="Recipient" onChange={e => setTo(e.target.value)} placeholder="0xA0Cf…251e" value={to} />
      <input aria-label="Amount (ether)" onChange={e => setAmount(e.target.value)} placeholder="0.05" value={amount} />
      <button disabled={isLoading || !submitTransaction || !to || !amount}>{isLoading ? "Sending..." : "Send"}</button>
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
