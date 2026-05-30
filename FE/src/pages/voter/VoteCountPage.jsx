import { getVoteCountApi } from "../../api/voteApi";
import { clearDedupe } from "../../utils/dedupe";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import PageHeader from "../../components/PageHeader";
import { getInitials } from "../../utils/helpers";

export default function VoteCountPage() {
  const { data: rows = [], loading, error, reload } = useFetch(getVoteCountApi, []);

  if (loading) return <Loader text="Loading results..." />;

  const totalVotes = rows.reduce((sum, item) => sum + item.vote_count, 0);
  const maxVotes = Math.max(...rows.map((r) => r.vote_count), 0);
  const leader = rows.find((r) => r.vote_count === maxVotes && maxVotes > 0);

  return (
    <section className="section">
      <PageHeader
        title="Live Vote Count"
        description="Current standings across all candidates."
        action={
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              clearDedupe("vote-count");
              reload(true);
            }}
          >
            Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
        <div className="stat-card">
          <p className="stat-label">Total votes</p>
          <p className="stat-value">{totalVotes}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Candidates</p>
          <p className="stat-value">{rows.length}</p>
        </div>
        {leader && (
          <div className="stat-card">
            <p className="stat-label">Leading</p>
            <p className="text-xl font-bold truncate">{leader.name}</p>
            <p className="text-success-600 font-semibold">{leader.vote_count} votes</p>
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card empty-state">
          <h3>No votes yet</h3>
          <p>Results appear after the first ballot is cast.</p>
        </div>
      ) : (
        <div className="card space-y-4">
          {rows.map((item, index) => {
            const percentage = totalVotes > 0 ? (item.vote_count / totalVotes) * 100 : 0;
            const isLeader = item.vote_count === maxVotes;

            return (
              <div
                key={`${item.name}-${index}`}
                className={`rounded-xl p-4 ${isLeader ? "bg-success-50 border-2 border-success-200" : "bg-slate-50 border border-slate-200"}`}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="candidate-avatar !w-10 !h-10 !text-sm">{getInitials(item.name)}</div>
                    <p className="font-bold truncate">{item.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-brand-600">{item.vote_count}</p>
                    <p className="text-sm text-slate-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="progress-track">
                  <div
                    className={`progress-fill${isLeader ? " leading" : ""}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
