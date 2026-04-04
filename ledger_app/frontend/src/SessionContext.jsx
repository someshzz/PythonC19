import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'ledger_current_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser)

  const setUser = useCallback((next) => {
    setUserState(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ user, setUser }), [user, setUser])
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
