import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusPill } from '../components/StatusPill';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchElections } from '../store/slices/electionsSlice';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, hasFetched } = useAppSelector(
    (s) => s.elections,
  );
  const user = useAppSelector((s) => s.user.current);
  const busy = status === 'loading';

  useEffect(() => {
    if (!hasFetched && status !== 'loading') dispatch(fetchElections());
  }, [dispatch, hasFetched, status]);

  const started = useMemo(
    () => items.filter((e) => e.status === 'STARTED'),
    [items],
  );
  const pending = useMemo(
    () => items.filter((e) => e.status === 'PENDING'),
    [items],
  );
  const ended = useMemo(
    () => items.filter((e) => e.status === 'ENDED'),
    [items],
  );

  return (
    <>
      <div className="pageHeader">
        <h1>Election Console</h1>
        <div className="subtitle">
          Overview of elections and your current voter.
        </div>
      </div>

      <div className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Overview</h2>
            <div className="btnRow">
              <button
                className="btn"
                disabled={busy}
                onClick={() => dispatch(fetchElections())}
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="cardBody stack">
            {error ? <div className="alert alertError">{error}</div> : null}

            <div className="row">
              <div className="muted">Total elections</div>
              <div className="pill">{items.length}</div>
            </div>
            <div className="row">
              <div className="muted">Started</div>
              <div className="pill pillStarted">{started.length}</div>
            </div>
            <div className="row">
              <div className="muted">Pending</div>
              <div className="pill pillPending">{pending.length}</div>
            </div>
            <div className="row">
              <div className="muted">Ended</div>
              <div className="pill pillEnded">{ended.length}</div>
            </div>

            <div className="btnRow">
              <Link className="btn btnPrimary" to="/elections">
                Manage elections
              </Link>
            </div>
          </div>
        </section>

        <aside className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Current voter</h2>
          </div>
          <div className="cardBody stack">
            <div>
              <div style={{ color: 'var(--heading)', fontWeight: 700 }}>
                {user?.name}
              </div>
              <div className="muted">{user?.email}</div>
            </div>
            <div className="alert">
              Tip: open an election to cast votes, then view results.
            </div>
          </div>
        </aside>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <h2 className="cardTitle">Elections</h2>
          <div className="btnRow">
            <Link to="/elections" className="btn">
              View all
            </Link>
          </div>
        </div>
        <div className="cardBody stack">
          {status === 'loading' ? (
            <div className="muted">Loading…</div>
          ) : items.length === 0 ? (
            <div className="muted">
              No elections yet. Create one in Elections.
            </div>
          ) : (
            items.slice(0, 6).map((e) => (
              <div key={e.id} className="row">
                <div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {e.title}
                  </div>
                  <div className="muted">Ends {e.endDate}</div>
                </div>
                <div className="btnRow">
                  <StatusPill status={e.status} />
                  <Link className="btn" to={`/elections/${e.id}`}>
                    Open
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
