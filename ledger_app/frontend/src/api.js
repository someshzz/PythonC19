const baseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000/api'

async function parseBody(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function formatApiError(data) {
  if (!data) return 'Request failed'
  if (typeof data === 'string') return data
  if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error)
  if (data.detail) return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
  const parts = []
  for (const [key, val] of Object.entries(data)) {
    if (Array.isArray(val)) parts.push(`${key}: ${val.join(', ')}`)
    else if (val && typeof val === 'object') parts.push(`${key}: ${JSON.stringify(val)}`)
    else parts.push(`${key}: ${val}`)
  }
  return parts.join('; ') || 'Request failed'
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const res = await fetch(url, { ...options, headers })
  const data = await parseBody(res)
  if (!res.ok) {
    const err = new Error(formatApiError(data))
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  listUsers: () => apiFetch('/users/'),
  createUser: (body) => apiFetch('/users/', { method: 'POST', body: JSON.stringify(body) }),
  setDefaultAccount: (userId, accountId) =>
    apiFetch(`/users/${userId}/set-default-account/`, {
      method: 'POST',
      body: JSON.stringify({ account: accountId }),
    }),
  listAccounts: () => apiFetch('/accounts/'),
  createAccount: (body) =>
    apiFetch('/accounts/', { method: 'POST', body: JSON.stringify(body) }),
  createTransaction: (body) =>
    apiFetch('/transactions/', { method: 'POST', body: JSON.stringify(body) }),
}
