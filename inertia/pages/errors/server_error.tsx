export default function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-900">500</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">Server error</h1>
        <p className="mt-2 text-sm text-gray-600">
          Something went wrong on our end. Please try again later.
        </p>
      </div>
    </div>
  )
}
