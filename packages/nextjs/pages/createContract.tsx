import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ContractList } from "~~/components/multisigcontract/createContract/ContractList";
import { CreateNewContract } from "~~/components/multisigcontract/createContract/CreateNewContract";

const CreateContract: NextPage = () => {
  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        {!isConnected ? (
          <div className="flex justify-center flex-col h-screen items-center">
            <span className="text-xl font-bold"> No wallet connected </span>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mt-5 text-center mb-4">
              <span className="block text-2xl font-bold">Create a new MultiSig Wallet </span>
            </div>
            <div className="flex justify-center mt-5">
              <CreateNewContract />
            </div>
            <div className="flex justify-center mt-5">
              <div className="text-center mb-4 mt-5">
                <span className="block text-2xl font-bold">Your Multi Sig Wallets </span>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <ContractList myAddress={address} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateContract;
