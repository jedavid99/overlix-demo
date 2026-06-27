import React, { createContext, useContext, ReactNode } from 'react'
// Minimal AppContext stub to allow the app to run during migration.
// Replace with the full implementation from `app/shared/hooks/useAppState` later.
type AppContextType = {
  // minimal placeholders
  selectedProduct?: any
  searchTerm?: string
  setSearchTerm?: (s: string) => void
  orders?: any[]
}
const AppContext = createContext<AppContextType | undefined>(undefined)
export function AppProvider({ children }: { children: ReactNode }) {
  const value: AppContextType = {
    selectedProduct: undefined,
    searchTerm: '',
    setSearchTerm: () => {},
    orders: [],
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
