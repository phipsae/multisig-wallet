import { useState } from "react";
import multiSigFactoryABI from "../../0_abi/multi_sig_factory_abi";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

export const AddOwners = () => {
  const [newAddress, setNewAddress] = useState<string>("");

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "MultiSigWallet",
    functionName: "addOwner",
    args: [newAddress],
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Do something with the input value, e.g., submit it to an API
    writeAsync();
    console.log("Input value submitted:", newAddress);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Enter address you want to add:</label>
        <input type="text" value={newAddress} onChange={handleInputChange} />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};
