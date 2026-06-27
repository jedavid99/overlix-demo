import React from 'react'
import RootLayout from './app/layout'
import { AppRouter } from './app/router'
export default function App() {
  return (
    <RootLayout>
      <AppRouter />
    </RootLayout>
  )
}
