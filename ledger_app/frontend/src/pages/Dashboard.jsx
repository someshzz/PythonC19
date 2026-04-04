import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatApiError } from '../api'
import { useSession } from '../SessionContext'

const CATEGORIES = [
  { value: 'HOUSEHOLD', label: 'Household' },
  { value: 'LEISURE', label: 'Leisure' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'MISCELLANEOUS', label: 'Miscellaneous' },
]

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'CC', label: 'Credit card' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
]

const ACCOUNT_TYPES = [
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'CURRENT', label: 'Current' },
]

export default function Dashboard() {
  const { user, setUser } = useSession()
  const [accounts, setAccounts] = useState([])
  const [loadError, setLoadError] = useState('')
  const [accountForm, setAccountForm] = useState({
    account_number: '',
    ifsc: '',
    account_type: 'SAVINGS',
    balance: '',
  })
  const [accountBusy, setAccountBusy] = useState(false)
  const [accountMsg, setAccountMsg] = useState('')

  const [payForm, setPayForm] = useState({
    from_account: '',
    phone_number: '',
    amount: '',
    category: 'HOUSEHOLD',
    payment_method: 'UPI',
    description: '',
  })
  const [payBusy, setPayBusy] = useState(false)
  const [payMsg, setPayMsg] = useState('')
  const [payError, setPayError] = useState('')
  const [defaultBusyId, setDefaultBusyId] = useState(null)
  const [defaultError, setDefaultError] = useState('')

  const loadAccounts = useCallback(async () => {
    setLoadError('')
    try {
      const data = await api.listAccounts()
      const list = Array.isArray(data) ? data : data.results || []
      setAccounts(list)
    } catch (err) {
      setLoadError(formatApiError(err.data) || err.message)
    }
  }, [])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const myAccounts = useMemo(
    () => accounts.filter((a) => a.user === user.id),
    [accounts, user.id],
  )

  const defaultAccountLabel = useMemo(() => {
    if (user.default_account == null) return null
    const a = myAccounts.find((x) => x.id === user.default_account)
    return a?.account_number ?? `#${user.default_account}`
  }, [myAccounts, user.default_account])

  function updateAccountField(e) {
    const { name, value } = e.target
    setAccountForm((f) => ({ ...f, [name]: value }))
  }

  async function addAccount(e) {
    e.preventDefault()
    setAccountMsg('')
    setAccountBusy(true)
    try {
      await api.createAccount({
        user: user.id,
        account_number: accountForm.account_number.trim(),
        ifsc: accountForm.ifsc.trim().toUpperCase(),
        account_type: accountForm.account_type,
        balance: accountForm.balance === '' ? '0.00' : String(accountForm.balance),
      })
      setAccountForm({
        account_number: '',
        ifsc: '',
        account_type: 'SAVINGS',
        balance: '',
      })
      setAccountMsg('Account added.')
      await loadAccounts()
    } catch (err) {
      setAccountMsg(formatApiError(err.data) || err.message)
    } finally {
      setAccountBusy(false)
    }
  }

  function updatePayField(e) {
    const { name, value } = e.target
    setPayForm((f) => ({ ...f, [name]: value }))
  }

  async function makeDefaultAccount(accountId) {
    setDefaultError('')
    setDefaultBusyId(accountId)
    try {
      const updated = await api.setDefaultAccount(user.id, accountId)
      setUser(updated)
    } catch (err) {
      setDefaultError(formatApiError(err.data) || err.message)
    } finally {
      setDefaultBusyId(null)
    }
  }

  async function sendMoney(e) {
    e.preventDefault()
    setPayError('')
    setPayMsg('')
    setPayBusy(true)
    try {
      await api.createTransaction({
        from_account: Number(payForm.from_account),
        phone_number: payForm.phone_number.trim(),
        amount: payForm.amount,
        category: payForm.category,
        payment_method: payForm.payment_method,
        description: payForm.description.trim(),
      })
      setPayMsg('Payment completed.')
      setPayForm((f) => ({
        ...f,
        phone_number: '',
        amount: '',
        description: '',
      }))
      await loadAccounts()
    } catch (err) {
      setPayError(formatApiError(err.data) || err.message)
    } finally {
      setPayBusy(false)
    }
  }

  return (
    <div className="page">
      <header className="top-bar">
        <div>
          <h1>Ledger</h1>
          <p className="muted small">
            {user.first_name} {user.last_name} · {user.phone_number}
            {defaultAccountLabel != null ? (
              <> · Receiving: {defaultAccountLabel}</>
            ) : (
              <> · No default account (set one below to receive transfers)</>
            )}
          </p>
        </div>
        <div className="top-actions">
          <Link to="/login" className="ghost">
            Switch user
          </Link>
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setUser(null)
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {loadError ? <div className="banner error">{loadError}</div> : null}
      {defaultError ? <div className="banner error">{defaultError}</div> : null}

      <section className="grid two">
        <div className="card">
          <h2>Your accounts</h2>
          <p className="muted small">
            Incoming payments use your default account. Choose one account as default.
          </p>
          {myAccounts.length === 0 ? (
            <p className="muted">No accounts yet. Add one on the right.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>IFSC</th>
                    <th>Type</th>
                    <th className="num">Balance</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  {myAccounts.map((a) => {
                    const isDefault = user.default_account === a.id
                    return (
                      <tr key={a.id}>
                        <td>{a.account_number}</td>
                        <td className="mono">{a.ifsc}</td>
                        <td>{a.account_type}</td>
                        <td className="num">₹{Number(a.balance).toFixed(2)}</td>
                        <td>
                          {isDefault ? (
                            <span className="badge default">Default</span>
                          ) : (
                            <button
                              type="button"
                              className="linkish"
                              disabled={defaultBusyId !== null}
                              onClick={() => makeDefaultAccount(a.id)}
                            >
                              {defaultBusyId === a.id ? 'Saving…' : 'Set as default'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Add account</h2>
          <form className="stack" onSubmit={addAccount}>
            {accountMsg ? (
              <div className={accountMsg.startsWith('Account') ? 'banner ok' : 'banner error'}>
                {accountMsg}
              </div>
            ) : null}
            <label>
              Account number
              <input
                name="account_number"
                value={accountForm.account_number}
                onChange={updateAccountField}
                required
                maxLength={30}
              />
            </label>
            <label>
              IFSC
              <input
                name="ifsc"
                value={accountForm.ifsc}
                onChange={updateAccountField}
                required
                maxLength={11}
                className="mono"
              />
            </label>
            <label>
              Type
              <select
                name="account_type"
                value={accountForm.account_type}
                onChange={updateAccountField}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Initial balance (optional)
              <input
                name="balance"
                type="number"
                min="0"
                step="0.01"
                value={accountForm.balance}
                onChange={updateAccountField}
                placeholder="0.00"
              />
            </label>
            <button type="submit" className="primary" disabled={accountBusy}>
              {accountBusy ? 'Saving…' : 'Add account'}
            </button>
          </form>
        </div>
      </section>

      <section className="card send-section">
        <h2>Send money</h2>
        <p className="muted small">
          Money is sent to the recipient&apos;s default account for their phone number (as configured
          in the backend).
        </p>
        <form className="stack pay-form" onSubmit={sendMoney}>
          {payError ? <div className="banner error">{payError}</div> : null}
          {payMsg ? <div className="banner ok">{payMsg}</div> : null}
          <label>
            From account
            <select
              name="from_account"
              value={payForm.from_account}
              onChange={updatePayField}
              required
            >
              <option value="">Select account</option>
              {myAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.account_number} (₹{Number(a.balance).toFixed(2)})
                </option>
              ))}
            </select>
          </label>
          <label>
            Recipient phone
            <input
              name="phone_number"
              value={payForm.phone_number}
              onChange={updatePayField}
              required
              maxLength={15}
              placeholder="Registered user phone"
            />
          </label>
          <label>
            Amount (₹)
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={payForm.amount}
              onChange={updatePayField}
              required
            />
          </label>
          <div className="row">
            <label className="grow">
              Category
              <select name="category" value={payForm.category} onChange={updatePayField}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grow">
              Payment method
              <select
                name="payment_method"
                value={payForm.payment_method}
                onChange={updatePayField}
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Note (optional)
            <input
              name="description"
              value={payForm.description}
              onChange={updatePayField}
              maxLength={500}
            />
          </label>
          <button type="submit" className="primary" disabled={payBusy || myAccounts.length === 0}>
            {payBusy ? 'Sending…' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  )
}
