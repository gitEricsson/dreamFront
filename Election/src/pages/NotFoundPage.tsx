import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="card">
      <div className="cardBody stack">
        <div style={{ color: 'var(--heading)', fontWeight: 750, fontSize: 18 }}>
          Page not found
        </div>
        <div className="muted">That route doesn’t exist in this UI.</div>
        <Link className="btn btnPrimary" to="/">
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

