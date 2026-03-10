interface ConfirmedProps {
  signerName: string
  decision: string
  signedAt: string
}

export default function ShareConfirmed({ signerName, decision, signedAt }: ConfirmedProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Sign-Off Submitted</h1>
        <p className="text-sm text-gray-600">
          Thank you, {signerName}. Your {decision} has been recorded.
        </p>
        <p className="text-xs text-gray-400">{signedAt}</p>
        <p className="text-xs text-gray-500 pt-2">You can close this page.</p>
      </div>
    </div>
  )
}
