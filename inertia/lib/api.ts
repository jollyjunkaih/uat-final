function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getCsrfToken(),
    ...(options.headers as Record<string, string> || {}),
  }

  const response = await fetch(url, { ...options, headers, credentials: 'same-origin' })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function apiUpload<T>(url: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-XSRF-TOKEN': getCsrfToken(),
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'same-origin',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.message || `Upload failed: ${response.status}`)
  }

  return response.json()
}
