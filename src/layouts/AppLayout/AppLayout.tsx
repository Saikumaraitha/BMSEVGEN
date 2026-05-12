import { type ReactNode } from 'react'
import TopBar from '../../components/TopBar/TopBar'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      <TopBar />
      <main className="flex-1 overflow-auto page-fade-in">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
