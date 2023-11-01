import { useState } from "react";
import { Bytes32Input } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const CreateNewContract = () => {
  const [confirmations, setConfirmations] = useState(0);
  const [confirmationsSet, setConfirmationsSet] = useState(false);

  const { writeAsync: createContract } = useScaffoldContractWrite({
    contractName: "MultiSigFactory",
    functionName: "createContract",
    // args: [BigInt(confirmations)],
    args: [BigInt(confirmations)],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <div>
        {confirmationsSet === false ? (
          <div className="flex flex-row mb-4 ">
            <span className="">
              <span>
                Enter how much confirmations your <br />
                new MultiSig wallet should have
              </span>
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
              Set confirmations
            </button>
          </div>
        ) : (
          <div>
            <button
              className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
              onClick={() => {
                setConfirmationsSet(false);
                createContract();
              }}
            >
              Create Contract with {confirmations} confirmations
            </button>
          </div>
        )}
      </div>
    </>
  );
};
