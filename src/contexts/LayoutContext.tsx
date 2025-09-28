"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface LayoutContextType {
  isContentTypeSelectorOpen: boolean;
  openContentTypeSelector: () => void;
  closeContentTypeSelector: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isContentTypeSelectorOpen, setIsContentTypeSelectorOpen] =
    useState(false);

  const openContentTypeSelector = () => setIsContentTypeSelectorOpen(true);
  const closeContentTypeSelector = () => setIsContentTypeSelectorOpen(false);

  return (
    <LayoutContext.Provider
      value={{
        isContentTypeSelectorOpen,
        openContentTypeSelector,
        closeContentTypeSelector,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    // Fallback to no-op functions when provider is missing
    return {
      isContentTypeSelectorOpen: false,
      openContentTypeSelector: () => {},
      closeContentTypeSelector: () => {},
    };
  }
  return context;
}
