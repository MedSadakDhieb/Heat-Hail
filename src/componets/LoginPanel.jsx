import { useMemo, useState } from 'react'
import users from '../data/users.json'

function LoginPanel({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', passcode: '' })
  const [status, setStatus] = useState(null)

  const userMap = useMemo(() => {
    const map = new Map()
    users.forEach((user) => {
      map.set(user.email.toLowerCase(), user)
    })
    return map
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const record = userMap.get(form.email.toLowerCase())
    if (!record) {
      setStatus({ ok: false, message: 'No agent registered with that call-sign.' })
      return
    }
    if (record.passcode !== form.passcode) {
      setStatus({ ok: false, message: 'Passcode mismatch. Climate lock remains closed.' })
      return
    }
    setStatus({
      ok: true,
      message: `Welcome back, ${record.role}. Systems warming up...`,
    })
    onSuccess?.(record)
  }

  return (
    <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <section className="login-section" id="login" aria-live="polite">
        <div className="login-panel">
          <button className="login-close" onClick={onClose} type="button" aria-label="Close login">
            ×
          </button>
          <p className="eyebrow">Secure lobby</p>
          <h2 id="login-title">Agent login</h2>
          <p className="login-copy">
            Authenticate with your faction credentials to access the Heat &amp; Hail command room.
          </p>
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <label className="input-group">
              <span>Agent email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="agent@heatandhail.gg"
                required
                autoComplete="off"
              />
            </label>

            <label className="input-group">
              <span>Passcode</span>
              <input
                type="password"
                name="passcode"
                value={form.passcode}
                onChange={handleChange}
                placeholder="•••••••"
                required
                autoComplete="off"
              />
            </label>

            <button type="submit" className="cta primary wide">
              Enter lobby
            </button>
          </form>

          {status && (
            <div className={`login-status ${status.ok ? 'success' : 'error'}`}>{status.message}</div>
          )}
        </div>
      </section>
    </div>
  )
}

export default LoginPanel

