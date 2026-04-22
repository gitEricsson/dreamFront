import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearUser,
  fetchUserByEmail,
  registerUser,
} from '../store/slices/userSlice';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const { current, status, error } = useAppSelector((s) => s.user);
  const busy = status === 'loading';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    await dispatch(registerUser({ name: name.trim(), email: email.trim() }));
    setName('');
    setEmail('');
  }

  async function onLookup(e: FormEvent) {
    e.preventDefault();
    const email = lookupEmail.trim();
    if (!email) return;
    await dispatch(fetchUserByEmail(email));
  }

  return (
    <>
      <div className="pageHeader">
        <h1>Voter</h1>
        <div className="subtitle">
          Register a user or load an existing one by email.
        </div>
      </div>

      <div className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Current voter</h2>
            {current ? (
              <button
                className="btn btnDanger"
                onClick={() => dispatch(clearUser())}
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="cardBody stack">
            {error ? <div className="alert alertError">{error}</div> : null}
            {current ? (
              <>
                <div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {current.name}
                  </div>
                  <div className="muted">{current.email}</div>
                </div>
                <div className="alert">
                  This voter is saved locally (browser storage) for convenience.
                </div>
              </>
            ) : (
              <div className="muted">No voter selected.</div>
            )}
          </div>
        </section>

        <aside className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Register</h2>
          </div>
          <div className="cardBody">
            <form className="stack" onSubmit={onRegister}>
              <div className="field">
                <div className="labelRow">
                  <div className="label">Name</div>
                </div>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="field">
                <div className="labelRow">
                  <div className="label">Email</div>
                </div>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <button className="btn btnPrimary" disabled={busy}>
                Register user
              </button>
            </form>
          </div>
        </aside>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <h2 className="cardTitle">Load by Email</h2>
        </div>
        <div className="cardBody">
          <form className="btnRow" onSubmit={onLookup}>
            <input
              className="input"
              style={{ maxWidth: 260 }}
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="User Email"
            />
            <button className="btn" disabled={busy}>
              Load
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
