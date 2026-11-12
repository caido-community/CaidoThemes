import { createContext, type ReactNode, useContext } from "react";

import type { CaidoSDK } from "@/types";

type SDKProviderProps = {
  sdk: CaidoSDK;
  children: ReactNode;
};

const SDKContext = createContext<CaidoSDK | undefined>(undefined);

export function SDKProvider({ sdk, children }: SDKProviderProps) {
  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
}

export function useSDK() {
  const context = useContext(SDKContext);
  if (context === undefined) {
    throw new Error("useSDK must be used within an SDKProvider");
  }
  return context;
}
