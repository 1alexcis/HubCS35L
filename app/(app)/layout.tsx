import { Sidebar } from '@/components/shell/sidebar'
import { TopBar } from '@/components/shell/topbar'
import { MembershipsProvider } from '@/lib/context/memberships'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MembershipsProvider>
      <div className="flex min-h-screen bg-bg-0">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </MembershipsProvider>
  )
}
