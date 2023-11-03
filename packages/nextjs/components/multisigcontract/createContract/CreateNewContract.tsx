import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bytes32Input } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const CreateNewContract = () => {
  const [confirmations, setConfirmations] = useState(0);
  const [confirmationsSet, setConfirmationsSet] = useState(false);

  const {
    writeAsync: createContract,
    isLoading: isLoadingCreateContract,
    // isSuccess: isSuccessCreateContract,
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

  return (
    <>
      <div>
        {confirmationsSet === false ? (
          <div>
            <div className="flex flex-row mb-4 justify-center">
              <span className="w-[100px]">
                <Bytes32Input
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
            <div className="text-center">
              <span className="text-center">Confirmations needed to approve transactions ✅</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row mb-4 justify-center">
              <button
                className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
                onClick={() => {
                  setConfirmationsSet(false);
                  createContract();
                }}
              >
                {isLoadingCreateContract ? (
                  <span className="loading loading-spinner text-primary"></span>
                ) : (
                  `Create Contract with ${confirmations} confirmations`
                )}
              </button>
              <button
                className="btn btn-error h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
                onClick={() => {
                  setConfirmationsSet(false);
                }}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <span className="text-center">&nbsp;&nbsp;&nbsp; </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
