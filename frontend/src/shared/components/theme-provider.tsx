'use client'
import * as React from 'react'
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark mode removed — passthrough provider to avoid breaking imports
  return <>{children}</>
}
