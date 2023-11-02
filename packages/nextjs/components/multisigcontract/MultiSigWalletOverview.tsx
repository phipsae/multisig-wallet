import { Address, Balance } from "~~/components/scaffold-eth";

export const MultiSigWalletOverview = (multiSigWalletAddress: any) => {
  return (
    <>
      <div>
        <div className="text-center mb-4">
          <span className="block text-2xl font-bold">Assets & Owners</span>
        </div>
        <div>
          Multi Sig Wallet Address: <Address address={multiSigWalletAddress.multiSigWalletAddress} />
        </div>
        <div className="mt-5">
          Multi Sig Wallet Balance:{" "}
          <Balance className="text-xl" address={multiSigWalletAddress.multiSigWalletAddress} />
        </div>
      </div>
    </>
  );
};
