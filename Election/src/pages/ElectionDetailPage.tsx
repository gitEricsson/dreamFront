import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { StatusPill } from '../components/StatusPill';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  endElection,
  fetchElections,
  startElection,
} from '../store/slices/electionsSlice';
import { fetchWinner } from '../store/slices/resultsSlice';
import {
  castVote,
  clearVoteStatus,
  clearError,
} from '../store/slices/votesSlice';

export function ElectionDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const electionId = (id ?? '').toString().trim();
  const fallbackIdFromPath =
    location.pathname.split('/').filter(Boolean).at(-1) ?? '';
  const effectiveElectionId = electionId || fallbackIdFromPath;
  const dispatch = useAppDispatch();

  const electionsState = useAppSelector((s) => s.elections);
  const election = useMemo(
    () =>
      electionsState.items.find((e) => e.id === effectiveElectionId) ?? null,
    [effectiveElectionId, electionsState.items],
  );

  const user = useAppSelector((s) => s.user.current);
  const votes = useAppSelector((s) => s.votes);

  const [optionId, setOptionId] = useState('');

  useEffect(() => {
    if (!electionsState.hasFetched && electionsState.status !== 'loading') {
      dispatch(fetchElections());
    }
  }, [dispatch, electionsState.hasFetched, electionsState.status]);

  const winner = useAppSelector(
    (s) => s.results.winnerByElectionId[effectiveElectionId],
  );

  useEffect(() => {
    if (effectiveElectionId) dispatch(fetchWinner(effectiveElectionId));
  }, [dispatch, effectiveElectionId]);

  useEffect(() => {
    return () => {
      dispatch(clearVoteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (votes.error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [votes.error, dispatch]);

  async function onVote(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    const oid = optionId.trim();
    if (!oid) return;
    await dispatch(
      castVote({
        userId: user.id,
        electionId: effectiveElectionId,
        optionId: oid,
      }),
    );
    setOptionId('');
  }

  if (!effectiveElectionId) {
    return (
      <div className="card">
        <div className="cardBody stack">
          <div style={{ color: 'var(--heading)', fontWeight: 700 }}>
            Couldn’t open that election
          </div>
          <div className="muted">
            The election id in the URL is missing or malformed.
          </div>
          <Link className="btn btnPrimary" to="/elections">
            Back to elections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pageHeader">
        <h1>Election</h1>
        <div className="subtitle">
          Manage this election, cast votes, and view results.
        </div>
      </div>

      <div className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">{election?.title ?? 'Loading…'}</h2>
            {election ? <StatusPill status={election.status} /> : null}
          </div>
          <div className="cardBody stack">
            {election ? (
              <>
                <div className="row">
                  <div className="muted">Description</div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {election.description}
                  </div>
                </div>

                <div className="row">
                  <div className="muted">End date</div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {election.endDate}
                  </div>
                </div>

                <div className="btnRow">
                  <Link className="btn" to="/elections">
                    Back
                  </Link>
                  <Link
                    className="btn"
                    to={`/elections/${effectiveElectionId}/results`}
                  >
                    Results
                  </Link>
                  <button
                    className="btn btnPrimary"
                    disabled={
                      electionsState.status === 'loading' ||
                      election.status !== 'PENDING'
                    }
                    onClick={() =>
                      dispatch(
                        startElection({
                          id: effectiveElectionId,
                          userId: user?.id || '',
                        }),
                      )
                    }
                  >
                    Start election
                  </button>
                  <button
                    className="btn btnDanger"
                    disabled={
                      electionsState.status === 'loading' ||
                      election.status !== 'STARTED'
                    }
                    onClick={() =>
                      dispatch(
                        endElection({
                          id: effectiveElectionId,
                          userId: user?.id || '',
                        }),
                      )
                    }
                  >
                    End election
                  </button>
                </div>
              </>
            ) : (
              <>
                {electionsState.error ? (
                  <div className="alert alertError">{electionsState.error}</div>
                ) : (
                  <div className="muted">Fetching election list…</div>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Cast vote</h2>
          </div>
          <div className="cardBody stack">
            {winner ? (
              <div className="helpText">
                Current leader: <strong>{winner.name}</strong> (ID {winner.id})
              </div>
            ) : (
              <div className="helpText">Loading current leader…</div>
            )}
            {!user ? (
              <div className="alert alertError">
                No voter selected. Set a voter first on the{' '}
                <Link to="/auth">Sign in / Register</Link> page.
              </div>
            ) : (
              <div className="alert">
                Voting as <strong>{user.name}</strong>
              </div>
            )}

            {votes.error ? (
              <div className="alert alertError">{votes.error}</div>
            ) : null}
            {votes.lastMessage ? (
              <div className="alert">{votes.lastMessage}</div>
            ) : null}

            <form className="stack" onSubmit={onVote}>
              <div className="field">
                <div className="labelRow">
                  <div className="label">Choose Option</div>
                </div>
                {election?.options?.map((option) => (
                  <label key={option.id} className="radio">
                    <input
                      type="radio"
                      name="option"
                      value={option.id}
                      checked={optionId === option.id}
                      onChange={(e) => setOptionId(e.target.value)}
                      disabled={!user || votes.status === 'loading'}
                      required
                    />
                    {option.name}
                  </label>
                )) || <div className="muted">No options available</div>}
              </div>

              <button
                className="btn btnPrimary"
                disabled={!user || votes.status === 'loading'}
              >
                Cast vote
              </button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
