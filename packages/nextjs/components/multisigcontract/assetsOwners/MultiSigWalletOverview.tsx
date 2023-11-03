import { useContractRead } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

export const MultiSigWalletOverview = (multiSigWalletAddress: any) => {
  const { data: multiSigWallet } = useScaffoldContract({
    contractName: "MultiSigWallet",
  });
  const { data: confirmationsRequired } = useContractRead({
    address: multiSigWalletAddress.multiSigWalletAddress,
    abi: multiSigWallet?.abi,
    functionName: "numConfirmationsRequired",
  });

  return (
    <>
      <div>
        <div>
          Multi Sig Wallet Address: <Address address={multiSigWalletAddress.multiSigWalletAddress} />
        </div>
        <div className="mt-5">
          Multi Sig Wallet Balance:{" "}
          <Balance className="text-xl" address={multiSigWalletAddress.multiSigWalletAddress} />
        </div>
        <div className="mt-5">Confirmations required: {Number(confirmationsRequired)}</div>
      </div>
    </>
  );
};
