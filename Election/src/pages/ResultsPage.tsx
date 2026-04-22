import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchElectionResults,
  fetchWinner,
  clearError,
} from '../store/slices/resultsSlice';

export function ResultsPage() {
  const { id } = useParams();
  const electionId = (id ?? '').toString().trim();
  const dispatch = useAppDispatch();

  const { detailsByElectionId, winnerByElectionId, status, error } =
    useAppSelector((s) => s.results);

  const details = detailsByElectionId[electionId];
  const winner = winnerByElectionId[electionId];

  useEffect(() => {
    if (!electionId) return;
    dispatch(fetchWinner(electionId));
    dispatch(fetchElectionResults(electionId));
  }, [dispatch, electionId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!electionId) {
    return (
      <div className="card">
        <div className="cardBody stack">
          <div style={{ color: 'var(--heading)', fontWeight: 700 }}>
            Couldn’t open results
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

  const candidateRows = details?.optionVotes
    ? Object.entries(details.optionVotes).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <>
      <div className="pageHeader">
        <h1>Results</h1>
        <div className="subtitle">Live snapshot of the election outcome.</div>
      </div>

      <div className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Winner</h2>
            <Link className="btn" to={`/elections/${electionId}`}>
              Back
            </Link>
          </div>
          <div className="cardBody stack">
            {error ? <div className="alert alertError">{error}</div> : null}

            {status === 'loading' && !winner ? (
              <div className="muted">Loading…</div>
            ) : winner ? (
              <div className="alert">
                <div
                  style={{
                    color: 'var(--heading)',
                    fontWeight: 750,
                    fontSize: 18,
                  }}
                >
                  {winner.name}
                </div>
              </div>
            ) : (
              <div className="muted">No winner yet.</div>
            )}
          </div>
        </section>

        <aside className="card">
          <div className="cardHeader">
            <h2 className="cardTitle">Details</h2>
          </div>
          <div className="cardBody stack">
            {status === 'loading' && !details ? (
              <div className="muted">Loading…</div>
            ) : details ? (
              <>
                <div>
                  <div className="muted">Election</div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {details.electionTitle}
                  </div>
                </div>
                <div>
                  <div className="muted">Winner name</div>
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {details.winnerName}
                  </div>
                </div>
              </>
            ) : (
              <div className="muted">No detailed results available.</div>
            )}
          </div>
        </aside>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="cardHeader">
          <h2 className="cardTitle">Option votes</h2>
        </div>
        <div className="cardBody stack">
          {details ? (
            candidateRows.length ? (
              candidateRows.map(([name, votes]) => (
                <div key={name} className="row">
                  <div style={{ color: 'var(--heading)', fontWeight: 650 }}>
                    {name}
                  </div>
                  <div className="pill">{votes.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="muted">No votes recorded.</div>
            )
          ) : (
            <div className="muted">Load an election to see vote counts.</div>
          )}
        </div>
      </section>
    </>
  );
}
