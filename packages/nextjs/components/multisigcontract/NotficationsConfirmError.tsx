import { useEffect } from "react";
import { useContractRead } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface NotficationsConfirmErrorProps {
  isSuccess: boolean;
  successMessage: string;
  isError: boolean;
  errorMessage: string;
  //   multiSigWalletAddress: any;
}

export const NotficationsConfirmError: React.FC<NotficationsConfirmErrorProps> = ({
  isSuccess,
  successMessage,
  isError,
  errorMessage,
  //   multiSigWalletAddress,
}) => {
  const { data: multiSigWalletInfo } = useDeployedContractInfo("MultiSigWallet");

  //   const { refetch: refetchGetTransactions } = useContractRead({
  //     address: multiSigWalletAddress.multiSigWalletAddress,
  //     abi: multiSigWalletInfo?.abi,
  //     functionName: "getTransactions",
  //   });

  useEffect(() => {
    if (multiSigWalletInfo?.abi && (isSuccess || isError)) {
      if (isSuccess) {
        console.log(successMessage);
        notification.success(successMessage);
        // refetchGetTransactions();
      }
      if (isError) {
        console.log(errorMessage);
        notification.error(errorMessage);
        // refetchGetTransactions();
      }
    }
  }, [isSuccess, successMessage, isError, errorMessage, multiSigWalletInfo?.abi]);

  return "";
};
