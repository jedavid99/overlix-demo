import './globals.css'
import { ClientProviders } from './providers'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientProviders>{children}</ClientProviders>
}
