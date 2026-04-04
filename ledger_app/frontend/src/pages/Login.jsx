import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatApiError } from '../api'
import { useSession } from '../SessionContext'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useSession()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api.listUsers()
        if (!cancelled) setUsers(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        if (!cancelled) setError(formatApiError(err.data) || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function select(u) {
    setUser(u)
    navigate('/', { replace: true })
  }

  return (
    <div className="page narrow">
      <header className="page-header">
        <h1>Choose profile</h1>
        <p className="muted">The API has no password auth yet; pick a user stored in the backend.</p>
      </header>

      {error ? <div className="banner error">{error}</div> : null}
      {loading ? (
        <p className="muted">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="card">
          <p>No users yet.</p>
          <Link to="/signup">Sign up</Link>
        </div>
      ) : (
        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id}>
              <button type="button" className="user-tile" onClick={() => select(u)}>
                <span className="name">
                  {u.first_name} {u.last_name}
                </span>
                <span className="muted small">{u.phone_number}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="muted center">
        New here? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}
