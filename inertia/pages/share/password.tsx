import { useState, type FormEvent } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

interface PasswordProps {
  token: string
  error?: string
}

export default function SharePassword({ token, error }: PasswordProps) {
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    router.visit(`/share/view/${token}?password=${encodeURIComponent(password)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">Password Required</h2>
          <p className="text-sm text-gray-600">
            This document is protected. Enter the password to continue.
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="share-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="share-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            />
          </div>
          <Button type="submit" className="w-full">
            View Document
          </Button>
        </form>
      </div>
    </div>
  )
}
