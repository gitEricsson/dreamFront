import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserByEmail, registerUser } from '../store/slices/userSlice';

export function AuthPage() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [mode, setMode] = useState<'register' | 'load'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');

  useEffect(() => {
    if (userState.current) navigate(from, { replace: true });
  }, [from, navigate, userState]);

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    await dispatch(registerUser({ name: name.trim(), email: email.trim() }));
  }

  async function onLookup(e: FormEvent) {
    e.preventDefault();
    const email = lookupEmail.trim();
    if (!email) return;
    await dispatch(fetchUserByEmail(email));
  }

  return (
    <>
      <div className="authShell">
        <section className="card authCard">
          <div className="cardHeader">
            <h2 className="cardTitle">Auth</h2>
            <div className="btnRow">
              <button
                className={`btn ${mode === 'register' ? 'btnPrimary' : ''}`}
                type="button"
                onClick={() => setMode('register')}
              >
                Register
              </button>
              <button
                className={`btn ${mode === 'load' ? 'btnPrimary' : ''}`}
                type="button"
                onClick={() => setMode('load')}
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="cardBody stack">
            <div>
              <div
                style={{
                  color: 'var(--heading)',
                  fontWeight: 750,
                  fontSize: 22,
                }}
              >
                Welcome
              </div>
              <div className="muted">
                Register a voter or sign an existing voter in by email.
              </div>
            </div>

            {userState.error ? (
              <div className="alert alertError">{userState.error}</div>
            ) : null}

            {mode === 'register' ? (
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
                <button
                  className="btn btnPrimary"
                  disabled={userState.status === 'loading'}
                >
                  Continue
                </button>
              </form>
            ) : (
              <form className="stack" onSubmit={onLookup}>
                <div className="field">
                  <div className="labelRow">
                    <div className="label">Email</div>
                    <div className="hint">e.g. john.doe@example.com</div>
                  </div>
                  <input
                    className="input"
                    type="email"
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <button
                  className="btn btnPrimary"
                  disabled={userState.status === 'loading'}
                >
                  Continue
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
