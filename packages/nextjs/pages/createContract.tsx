import { useEffect, useState } from "react";
import multiSigFactoryABI from "../0_abi/multi_sig_factory_abi";
import { fetchBalance, getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { AddOwners } from "~~/components/multisigcontract/addowners";
import { Address, Bytes32Input, ContractInput } from "~~/components/scaffold-eth";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const CreateContract: NextPage = () => {
  const [confirmations, setConfirmations] = useState(0);
  const [confirmationsSet, setConfirmationsSet] = useState(false);

  const [myAddress, setMyAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const [multiSigWallet, setMultiSigWallet] = useState("");

  useEffect(() => {
    if (walletConnected) {
      setMyAddress(getAccount().address?.toString() || "");
      console.log("from UseEffect, ", myAddress);
      if (myAddress != "") {
        setWalletConnected(true);
      }
    } else {
      setMyAddress("");
    }
  }, [myAddress]);

  const {
    writeAsync: createContract,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "MultiSigFactory",
    functionName: "createContract",
    // args: [BigInt(confirmations)],
    args: [BigInt(confirmations)],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: multiSigContracts } = useScaffoldContractRead({
    contractName: "MultiSigFactory",
    functionName: "getMultiSigContracts",
  });

  // const {
  //   data: events,
  //   isLoading: isLoadingEvents,
  //   error: errorReadingEvents,
  // } = useScaffoldEventHistory({
  //   contractName: "MultiSigFactory",
  //   eventName: "NewMultiSigContract",
  //   // Specify the starting block number from which to read events, this is a bigint.
  //   fromBlock: 31231n,
  //   blockData: true,
  //   // Apply filters to the event based on parameter names and values { [parameterName]: value },
  //   // filters: { premium: true }
  //   // If set to true it will return the transaction data for each event (default: false),
  //   transactionData: true,
  //   // If set to true it will return the receipt data for each event (default: false),
  //   receiptData: true,
  // });

  // Events
  // const { data: eventsAddedOwner, isLoading: isApprovalEventsLoading } = useScaffoldEventHistory({
  //   contractName: "MultiSigFactory",
  //   eventName: "OwnerAdded",
  //   fromBlock: 0n,
  // });

  return (
    <>
      <div className="text-center mb-4 mt-5">
        <span className="block text-2xl font-bold">Create your Multi Sig Wallet </span>
      </div>
      {multiSigContracts?.map((contract, index) => {
        console.log(contract);
        return (
          <div key={index} onClick={() => setMultiSigWallet(contract.contractAddress)}>
            <h2>{contract.owner}</h2>
          </div>
        );
      })}
      <div>
        {!walletConnected ? (
          <button
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
            onClick={() => {
              setMyAddress(getAccount().address?.toString() || "");
              setWalletConnected(true);
              // console.log(myAddress);
            }}
          >
            Connect Wallet Account
          </button>
        ) : (
          <div>
            {confirmationsSet === false ? (
              <div className="flex flex-row mb-4 ">
                <span className="">
                  <h2>Enter address you want to add:</h2>
                  <Bytes32Input
                    placeholder="Address.."
                    aria-label="Adress"
                    value={confirmations.toString()}
                    onChange={confirmations => setConfirmations(Number(confirmations))}
                  />
                </span>
                <button
                  className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
                  onClick={() => setConfirmationsSet(true)}
                >
                  Send
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
                  onClick={() => {
                    console.log(confirmationsSet);
                    setConfirmationsSet(false);
                    createContract();
                  }}
                >
                  Create Contract
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {walletConnected && (
        <button
          className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
          onClick={() => {
            setWalletConnected(false);
            setMyAddress("");
          }}
        >
          Disconnect Wallet
        </button>
      )}
    </>
  );
};

export default CreateContract;
