import { AppProvider } from "@/app/shared/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { LoadingProvider } from "@/contexts/LoadingContext"
import { GlobalLoader } from "@/shared/components/GlobalLoader"
function LayoutContent({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen">{children}</main>
}
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <LoadingProvider>
        <AuthProvider>
          <GlobalLoader />
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </LoadingProvider>
    </AppProvider>
  )
}
