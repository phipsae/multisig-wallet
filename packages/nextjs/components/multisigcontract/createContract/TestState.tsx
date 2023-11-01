import { useState } from "react";
import { Bytes32Input } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface TestStateProps {
  myAddress: string;
  setMyAddress: React.Dispatch<React.SetStateAction<string>>;
}

export const TestState: React.FC<TestStateProps> = ({ myAddress, setMyAddress }) => {
  return (
    <>
      <div>This is my address from TestState {myAddress}</div>
      <div onClick={() => setMyAddress("HUHU")}>Set the address to HUHU</div>
      {/* {console.log(myAddress)} */}
    </>
  );
};
