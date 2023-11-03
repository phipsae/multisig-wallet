import React from "react";
import { useSharedState } from "../../sharedStateContext";

interface AccountConnectButtonProps {
  walletConnect: boolean;
  address: string;
}

export const AccountConnectButton: React.FC<AccountConnectButtonProps> = ({ walletConnect, address }) => {
  const { walletConnected, setWalletConnected } = useSharedState();
  const { setMyAddress } = useSharedState();

  return (
    <>
      {walletConnect ? (
        <button
          className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
          onClick={() => {
            setWalletConnected(walletConnect);
            setMyAddress(address);
            console.log(walletConnected);
          }}
        >
          {walletConnect ? "Connect Account" : "Disconnect Account"}
        </button>
      ) : (
        <button
          className="btn btn-error h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
          onClick={() => {
            setWalletConnected(walletConnect);
            setMyAddress(address);
            console.log(walletConnected);
          }}
        >
          {walletConnect ? "Connect Account" : "Disconnect Account"}
        </button>
      )}
      {/* <button
        className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto mx-2"
        onClick={() => {
          setWalletConnected(walletConnect);
          setMyAddress(address);
          console.log(walletConnected);
        }}
      >
        {walletConnect ? "Connect Account" : "Disconnect Account"}
      </button> */}
    </>
  );
};
