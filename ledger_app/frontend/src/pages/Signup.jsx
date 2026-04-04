import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatApiError } from '../api'
import { useSession } from '../SessionContext'

export default function Signup() {
  const navigate = useNavigate()
  const { user, setUser } = useSession()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    phone_number: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await api.createUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        dob: form.dob,
        phone_number: form.phone_number.trim(),
      })
      setUser(user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(formatApiError(err.data) || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <header className="page-header">
        <h1>Create account</h1>
        <p className="muted">Sign up to manage bank accounts and send money.</p>
      </header>

      <form className="card form-card" onSubmit={onSubmit}>
        {error ? <div className="banner error">{error}</div> : null}
        <label>
          First name
          <input name="first_name" value={form.first_name} onChange={update} required />
        </label>
        <label>
          Last name
          <input name="last_name" value={form.last_name} onChange={update} required />
        </label>
        <label>
          Date of birth
          <input name="dob" type="date" value={form.dob} onChange={update} required />
        </label>
        <label>
          Phone number
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={update}
            required
            maxLength={15}
            placeholder="Receiver will use this to receive transfers"
          />
        </label>
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      <p className="muted center">
        Already registered? <Link to="/login">Choose your profile</Link>
      </p>
    </div>
  )
}
