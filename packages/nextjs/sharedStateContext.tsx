// sharedStateContext.tsx
import { ReactNode, createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  sharedVariable: string;
  setSharedVariable: (value: string) => void;
  multiSigWalletAddress: string;
  setMultiSigWalletAddress: (value: string) => void;
  walletConnected: boolean;
  setWalletConnected: (value: boolean) => void;
  myAddress: string;
  setMyAddress: (value: string) => void;
  selectedRowIndex: string | null;
  setSelectedRowIndex: (value: string | null) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sharedVariable, setSharedVariable] = useState<string>("");
  const [multiSigWalletAddress, setMultiSigWalletAddress] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [myAddress, setMyAddress] = useState<string>("");
  const [selectedRowIndex, setSelectedRowIndex] = useState<string | null>(null);

  return (
    <SharedStateContext.Provider
      value={{
        sharedVariable,
        setSharedVariable,
        multiSigWalletAddress,
        setMultiSigWalletAddress,
        walletConnected,
        setWalletConnected,
        myAddress,
        setMyAddress,
        selectedRowIndex,
        setSelectedRowIndex,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};
