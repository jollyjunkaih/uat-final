import { Link } from '@inertiajs/react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          PRD & UAT Builder
        </h1>
        <p className="mt-6 text-xl text-gray-600">
          Build and manage Product Requirements Documents and User Acceptance Testing flows
          with built-in version control and approval workflows.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow hover:bg-gray-800"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
