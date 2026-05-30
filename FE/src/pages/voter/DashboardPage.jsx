import { useState } from "react";
import { getCandidatesApi, voteApi } from "../../api/voteApi";
import { clearDedupe } from "../../utils/dedupe";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmModal";
import CandidatePhoto from "../../components/CandidatePhoto";
import { partyColor, getErrorMessage } from "../../utils/helpers";

export default function DashboardPage() {
  const { data: candidates = [], loading, error, reload } = useFetch(getCandidatesApi, []);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [votedId, setVotedId] = useState(null);
  const [confirmCandidate, setConfirmCandidate] = useState(null);

  const castVote = async () => {
    if (!confirmCandidate) return;
    setMessage("");
    setActionError("");
    setVotedId(confirmCandidate.id);
    try {
      const response = await voteApi(confirmCandidate.id);
      setMessage(response.message || "Vote submitted successfully.");
      setConfirmCandidate(null);
      clearDedupe("candidates");
      clearDedupe("vote-count");
      reload(true);
    } catch (err) {
      setActionError(getErrorMessage(err, "Vote failed"));
    } finally {
      setVotedId(null);
    }
  };

  if (loading) return <Loader text="Loading candidates..." />;

  return (
    <section className="section">
      <PageHeader
        title="Cast Your Vote"
        description="Select a candidate and submit your ballot."
      />

      {(error || actionError) && (
        <div className="mb-6">
          <ErrorMessage message={error || actionError} />
        </div>
      )}

      {message && <div className="alert-success mb-6">{message}</div>}

      {candidates.length === 0 ? (
        <div className="card empty-state">
          <h3>No candidates yet</h3>
          <p>Check back when admins add candidates.</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {candidates.map((candidate) => {
            const colors = partyColor(candidate.party);
            const isVoting = votedId === candidate.id;

            return (
              <article key={candidate.id} className="card candidate-card card-interactive vote-card">
                <CandidatePhoto name={candidate.name} imageUrl={candidate.image_url} size="lg" />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                  <span
                    className="party-badge mt-2 inline-flex"
                    style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                  >
                    {candidate.party}
                  </span>
                  <p className="mt-2 text-sm text-slate-500">Age {candidate.age}</p>
                </div>
                <button
                  className="btn w-full mt-5"
                  type="button"
                  disabled={isVoting}
                  onClick={() => setConfirmCandidate(candidate)}
                >
                  {isVoting ? "Submitting..." : "Vote"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(confirmCandidate)}
        title="Confirm your vote"
        message={
          confirmCandidate
            ? `Vote for ${confirmCandidate.name} (${confirmCandidate.party})? This cannot be undone.`
            : ""
        }
        confirmLabel="Cast vote"
        onConfirm={castVote}
        onCancel={() => setConfirmCandidate(null)}
        loading={Boolean(votedId)}
      />
    </section>
  );
}
