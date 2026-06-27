import { AppProvider } from "@/app/shared/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
function LayoutContent({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen">{children}</main>
}
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </AppProvider>
  )
}
