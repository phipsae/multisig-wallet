import { useCallback, useEffect, useMemo, useState } from "react";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import input from "antd/lib/input";
import { CreateEthersModalConnector, EthersModalConnector, useEthersContext } from "eth-hooks/context";
import { TEthersProvider, TNetworkInfo } from "eth-hooks/models";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { ICoreOptions } from "web3modal";
import { localProvider, mainnetProvider, targetNetworkInfo } from "~~/config/providersConfig";

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  mainnetProvider: StaticJsonRpcProvider;
  localProvider: StaticJsonRpcProvider;
  createLoginConnector: CreateEthersModalConnector;
}

export const useScaffoldProviders = (): IScaffoldAppProviders => {
  const [web3Config, setWeb3Config] = useState<Partial<ICoreOptions>>();
  const ethersContext = useEthersContext();

  useEffect(() => {
    // import async to split bundles
    const importedConfig = import("../../../../config/web3ModalConfig");

    importedConfig.then(getter => {
      getter.getWeb3ModalConfig().then(config => {
        setWeb3Config(config);
      });
    });
  }, []);

  const { currentTheme } = useThemeSwitcher();

  const createLoginConnector: CreateEthersModalConnector = useCallback(
    (id?: string) => {
      if (web3Config) {
        const connector = new EthersModalConnector(
          { ...web3Config, theme: currentTheme },
          { reloadOnNetworkChange: false, immutableProvider: false },
          id,
        );
        return connector;
      }
    },
    [web3Config, currentTheme],
  );

  useEffect(() => {
    if (!ethersContext.active && createLoginConnector) {
      const connector = createLoginConnector();
      if (connector) ethersContext.activate(connector);
    }
  }, [web3Config]);

  return {
    currentProvider: ethersContext.ethersProvider ?? localProvider,
    mainnetProvider: mainnetProvider,
    localProvider: localProvider,
    targetNetwork: targetNetworkInfo,
    createLoginConnector: createLoginConnector,
  };
};
