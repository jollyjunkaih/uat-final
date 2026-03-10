import { ReactNode } from 'react'
import { Toaster } from 'sonner'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4">
          <p className="text-sm font-semibold text-gray-900">PRD & UAT Builder</p>
        </div>
      </header>
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">{children}</main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
