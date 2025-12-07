import React, { createContext, useContext, useRef, useMemo } from "react";
import { AdaptiveController } from "../core/adaptiveController";
import type { AdaptiveContextValue } from "./types";

const AdaptiveContext = createContext<AdaptiveContextValue | null>(null);

export const AdaptiveProvider: React.FC<{
  children: React.ReactNode;
  debug?: boolean;
}> = ({ children, debug = false }) => {
  const controllerRef = useRef<AdaptiveController>(null);

  if (!controllerRef.current) {
    controllerRef.current = new AdaptiveController({
      debug,
    });
  }

  const contextValue = useMemo<AdaptiveContextValue>(
    () => ({
      register: (id, config) => controllerRef.current!.register(id, config),
      unregister: (id) => controllerRef.current!.unregister(id),
      updateColor: (id, color) => controllerRef.current!.updateColor(id, color),
      getColor: (id) => controllerRef.current!.getColor(id),
    }),
    []
  );

  return (
    <AdaptiveContext.Provider value={contextValue}>
      {children}
    </AdaptiveContext.Provider>
  );
};

export const useAdaptiveContext = () => {
  const context = useContext(AdaptiveContext);
  if (!context) {
    throw new Error("useAdaptiveContext must be used within AdaptiveProvider");
  }
  return context;
};
