import { useEffect } from "react";
import Link from "next/link";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

export const ContractList = (myAddress: any) => {
  const { data: multiSigContracts } = useScaffoldContractRead({
    contractName: "MultiSigFactory",
    functionName: "getMultiSigContracts",
  });
  const { selectedRowIndex, setSelectedRowIndex } = useSharedState();

  const { setMultiSigWalletAddress } = useSharedState();

  useEffect(() => {
    console.log("from Use Effect selected Row Index Address", selectedRowIndex);
  }, [selectedRowIndex]);

  return (
    <>
      <div className="overflow-x-auto shadow-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="bg-primary">Contract Address</th>
              <th className="bg-primary">Confirmations required</th>
              <th className="bg-primary">Owner</th>
              <th className="bg-primary">Balance</th>
              <th className="bg-primary">Select wallet</th>
            </tr>
          </thead>
          <tbody>
            {!multiSigContracts || multiSigContracts.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  No multi sig contracts added yet
                </td>
              </tr>
            ) : (
              multiSigContracts?.flatMap(contract => {
                return contract.signers.map(signer => {
                  if (signer == myAddress.myAddress) {
                    return (
                      <tr
                        key={contract.contractAddress}
                        className={selectedRowIndex === contract.contractAddress ? "bg-blue-100" : ""}
                      >
                        <td className="text-center">
                          <Address address={contract.contractAddress} />
                        </td>
                        <td className="text-center">{Number(contract.requiredConfirmations)}</td>
                        <td className="text-center">
                          <Address address={contract.owner} />
                        </td>
                        <td className="text-center">
                          <Balance className="text-xl" address={contract.contractAddress} />
                        </td>

                        <td
                          className="text-center"
                          onClick={() => {
                            setSelectedRowIndex(contract.contractAddress);
                            setMultiSigWalletAddress(contract.contractAddress);
                          }}
                        >
                          <Link href="/assetsOwners">
                            <input type="checkbox" checked={selectedRowIndex === contract.contractAddress} readOnly />
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                });
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
