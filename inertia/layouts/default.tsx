import { ReactElement } from 'react'
import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage, Link, router } from '@inertiajs/react'
import { useEffect } from 'react'
import { cn } from '~/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Projects', href: '/projects', icon: 'FolderKanban' },
  { label: 'Versions & Sign-Offs', href: '/versions', icon: 'FileCheck' },
]

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  useEffect(() => {
    toast.dismiss()
  }, [usePage().url])

  if (children.props.flash?.error) {
    toast.error(children.props.flash.error)
  }

  const currentPath = usePage().url

  if (currentPath.startsWith('/share/')) {
    return (
      <>
        {children}
        <Toaster position="top-center" richColors />
      </>
    )
  }

  if (!children.props.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-8">{children}</div>
        <Toaster position="top-center" richColors />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">PRD & UAT Builder</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentPath.startsWith(item.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
              {children.props.user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {children.props.user.fullName}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.post('/logout')}
            className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900 text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </main>
      <Toaster position="top-center" richColors />
    </div>
  )
}
