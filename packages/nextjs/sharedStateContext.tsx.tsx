// sharedStateContext.tsx
import { ReactNode, createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  sharedVariable: string;
  setSharedVariable: (value: string) => void;
  multiSigWalletAddress: string;
  setMultiSigWalletAddress: (value: string) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sharedVariable, setSharedVariable] = useState<string>("");
  const [multiSigWalletAddress, setMultiSigWalletAddress] = useState<string>("");

  return (
    <SharedStateContext.Provider
      value={{ sharedVariable, setSharedVariable, multiSigWalletAddress, setMultiSigWalletAddress }}
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
