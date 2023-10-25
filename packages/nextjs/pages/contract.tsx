import multiSigFactoryABI from "../0_abi/multi_sig_factory_abi";
import type { NextPage } from "next";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { AddOwners } from "~~/components/multisigcontract/addowners";
import { Address, ContractInput } from "~~/components/scaffold-eth";
import {
  useAnimationConfig,
  useScaffoldContract,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

const Contract: NextPage = () => {
  // WAGMI read contract
  //   const { chainId, isError, isLoadingOwners } = useContractRead({
  //     address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
  //     abi: multiSigFactoryABI,
  //     functionName: "chainId",
  //   });

  // WAGMI: contract write
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    abi: multiSigFactoryABI,
    functionName: "removeOwner",
  });

  const { data: owners } = useScaffoldContractRead({
    contractName: "MultiSigFactory",
    functionName: "getOwners",
  });

  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "MultiSigFactory",
  //   functionName: "removeOwner",
  //   args: ["The value to set"],
  //   // For payable functions, expressed in ETH
  //   value: "0.01",
  //   // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
  //   blockConfirmations: 1,
  //   // The callback function to execute when the transaction is confirmed.
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: "MultiSigFactory",
    eventName: "NewMultiSigContract",
    // Specify the starting block number from which to read events, this is a bigint.
    fromBlock: 31231n,
    blockData: true,
    // Apply filters to the event based on parameter names and values { [parameterName]: value },
    // filters: { premium: true }
    // If set to true it will return the transaction data for each event (default: false),
    transactionData: true,
    // If set to true it will return the receipt data for each event (default: false),
    receiptData: true,
  });

  // Events
  const { data: eventsAddedOwner, isLoading: isApprovalEventsLoading } = useScaffoldEventHistory({
    contractName: "MultiSigFactory",
    eventName: "OwnerAdded",
    fromBlock: 0n,
  });

  const getArray = async () => {
    console.log(owners);
    // write();
    // return returnOwners;
  };

  return (
    <>
      <h1> Create your Multi Sig Wallet </h1>
      <AddOwners />
      {/* potential owners list - with remove */}
      <button onClick={() => getArray()}>Button</button>
      {
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">Potential Owner List</span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Address Owner</th>
                  <th className="bg-primary">Remove</th>
                </tr>
              </thead>
              <tbody>
                {!owners || owners.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No owners added yet
                    </td>
                  </tr>
                ) : (
                  owners?.map((owner, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          <Address address={owner} />
                        </td>
                        <td className="text-center">
                          <button
                            disabled={!write}
                            onClick={() =>
                              write({
                                args: [owner],
                              })
                            }
                          >
                            Remove
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
      }
      {/* add owners to the list */}

      {/* add owners to the list */}
      {/* working event display */}
      {isApprovalEventsLoading ? (
        <div className="flex justify-center items-center mt-10"></div>
      ) : (
        <div className="mt-8">
          <div className="text-center mb-4">
            <span className="block text-2xl font-bold">Approval Events</span>
          </div>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-primary">Address Owner</th>
                  <th className="bg-primary">Remove</th>
                </tr>
              </thead>
              <tbody>
                {!eventsAddedOwner || eventsAddedOwner.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  eventsAddedOwner?.map((event, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">
                          <Address address={event.args.owner} />
                        </td>
                        <td className="text-center">
                          <button
                            disabled={!write}
                            onClick={() =>
                              write({
                                args: [event.args.owner],
                              })
                            }
                          >
                            Claim
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
      )}
    </>
  );
};

export default Contract;
