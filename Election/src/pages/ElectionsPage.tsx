import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { StatusPill } from '../components/StatusPill';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createElection,
  deleteElection,
  endElection,
  fetchElections,
  startElection,
} from '../store/slices/electionsSlice';

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function ElectionsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, hasFetched } = useAppSelector(
    (s) => s.elections,
  );
  const user = useAppSelector((s) => s.user.current);
  const busy = status === 'loading';

  const defaultStart = useMemo(() => todayISO(), []);
  const defaultEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState('');
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    if (!hasFetched && status !== 'loading') dispatch(fetchElections());
  }, [dispatch, hasFetched, status]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !user || !options.trim()) return;
    const optionsArray = options
      .split(',')
      .map((o) => o.trim())
      .filter((o) => o);
    if (optionsArray.length === 0) return;
    await dispatch(
      createElection({
        title: title.trim(),
        description: description.trim(),
        creatorId: user.id,
        startDate,
        endDate,
        options: optionsArray,
      }),
    );
    setTitle('');
    setDescription('');
    setOptions('');
  }

  return (
    <>
      <div className="pageHeader">
        <h1>Elections</h1>
        <div className="subtitle">Create, start/end, and open an election.</div>
      </div>

      <div className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">All elections</h2>
            <div className="btnRow">
              <button
                className="btn"
                onClick={() => dispatch(fetchElections())}
                disabled={busy}
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="cardBody stack">
            {error ? <div className="alert alertError">{error}</div> : null}
            {status === 'loading' ? (
              <div className="muted">Loading…</div>
            ) : items.length === 0 ? (
              <div className="muted">
                Nothing here yet. Create your first election.
              </div>
            ) : (
              items.map((election) => (
                <div key={election.id} className="row">
                  <div>
                    <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                      {election.title}
                    </div>
                    <div className="muted">Ends {election.endDate}</div>
                  </div>
                  <div className="btnRow">
                    <StatusPill status={election.status} />

                    <Link className="btn" to={`/elections/${election.id}`}>
                      Open
                    </Link>

                    <button
                      className="btn btnPrimary"
                      disabled={busy || election.status !== 'PENDING' || !user}
                      onClick={() =>
                        dispatch(
                          startElection({
                            id: election.id,
                            userId: user?.id || '',
                          }),
                        )
                      }
                    >
                      Start
                    </button>

                    <button
                      className="btn btnDanger"
                      disabled={busy || election.status !== 'STARTED' || !user}
                      onClick={() =>
                        dispatch(
                          endElection({
                            id: election.id,
                            userId: user?.id || '',
                          }),
                        )
                      }
                    >
                      End
                    </button>

                    <button
                      className="btn btnDanger"
                      disabled={busy || !user}
                      onClick={() =>
                        dispatch(
                          deleteElection({
                            id: election.id,
                            userId: user?.id || '',
                          }),
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Create election</h2>
          </div>
          <div className="cardBody">
            <form className="stack" onSubmit={onCreate}>
              <div className="field">
                <div className="labelRow">
                  <div className="label">Title</div>
                  <div className="hint">e.g. "Pizza Topping Vote"</div>
                </div>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Election title"
                  required
                />
              </div>

              <div className="field">
                <div className="labelRow">
                  <div className="label">Description</div>
                  <div className="hint">
                    e.g. "Deciding the lunch for Friday"
                  </div>
                </div>
                <textarea
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Election description"
                />
              </div>

              <div className="field">
                <div className="labelRow">
                  <div className="label">Options</div>
                  <div className="hint">
                    Comma-separated list, e.g. "Pepperoni, Mushroom, Pineapple"
                  </div>
                </div>
                <input
                  className="input"
                  value={options}
                  onChange={(e) => setOptions(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                  required
                />
              </div>

              <div className="field">
                <div className="labelRow">
                  <div className="label">Start date</div>
                </div>
                <input
                  className="input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <div className="labelRow">
                  <div className="label">End date</div>
                </div>
                <input
                  className="input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <button className="btn btnPrimary" disabled={busy || !user}>
                Create
              </button>
              <div className="helpText">
                Create an election, then open it to vote and view results.
              </div>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
