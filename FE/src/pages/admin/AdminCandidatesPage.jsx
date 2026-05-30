import { useState } from "react";
import { createCandidateApi, deleteCandidateApi, updateCandidateApi } from "../../api/adminApi";
import { getCandidatesApi } from "../../api/voteApi";
import useFetch from "../../hooks/useFetch";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmModal";
import CandidatePhoto from "../../components/CandidatePhoto";
import { partyColor, getErrorMessage } from "../../utils/helpers";

const emptyCandidate = { name: "", party: "", age: "", image_url: "" };

export default function AdminCandidatesPage() {
  const { data: candidates = [], loading, error, reload } = useFetch(getCandidatesApi, []);
  const [form, setForm] = useState(emptyCandidate);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyCandidate);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setActionError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        party: form.party,
        age: Number(form.age),
        image_url: form.image_url.trim() || null
      };
      if (editingId) {
        await updateCandidateApi(editingId, payload);
        setMessage("Candidate updated.");
      } else {
        await createCandidateApi(payload);
        setMessage("Candidate added.");
      }
      resetForm();
      reload(true);
    } catch (err) {
      setActionError(getErrorMessage(err, "Save failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEdit = (candidate) => {
    setEditingId(candidate.id);
    setForm({
      name: candidate.name,
      party: candidate.party,
      age: String(candidate.age),
      image_url: candidate.image_url || ""
    });
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setActionError("");
    setMessage("");
    setDeletingId(deleteTarget.id);
    try {
      await deleteCandidateApi(deleteTarget.id);
      setMessage("Candidate deleted.");
      setDeleteTarget(null);
      reload(true);
    } catch (err) {
      setActionError(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loader text="Loading candidates..." />;

  return (
    <section className="section">
      <PageHeader title="Manage Candidates" description="Create, update, or remove election candidates." />

      <form className={`card mb-8 space-y-4 ${editingId ? "ring-2 ring-brand-200" : ""}`} onSubmit={onSubmit}>
        <h2 className="card-title">{editingId ? "Edit candidate" : "Add candidate"}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input className="field" name="name" placeholder="Name *" value={form.name} onChange={onChange} required />
          <input className="field" name="party" placeholder="Party *" value={form.party} onChange={onChange} required />
          <input
            className="field"
            name="age"
            type="number"
            min="18"
            placeholder="Age *"
            value={form.age}
            onChange={onChange}
            required
          />
          <input
            className="field sm:col-span-2"
            name="image_url"
            type="url"
            placeholder="Image URL (https://...)"
            value={form.image_url}
            onChange={onChange}
          />
        </div>
        {form.image_url && (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 border border-slate-200">
            <CandidatePhoto name={form.name || "Preview"} imageUrl={form.image_url} size="sm" />
            <span className="text-sm text-slate-500">Image preview</span>
          </div>
        )}
        <div className="flex gap-3">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {(error || actionError) && (
        <div className="mb-6">
          <ErrorMessage message={error || actionError} />
        </div>
      )}
      {message && <div className="alert-success mb-6">{message}</div>}

      {candidates.length === 0 ? (
        <div className="card empty-state">
          <h3>No candidates</h3>
          <p>Add one using the form above.</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {candidates.map((candidate) => {
            const colors = partyColor(candidate.party);
            return (
              <article key={candidate.id} className="card card-interactive">
                <CandidatePhoto name={candidate.name} imageUrl={candidate.image_url} size="lg" />
                <div className="mt-4">
                  <h3 className="font-bold text-lg">{candidate.name}</h3>
                  <span
                    className="party-badge mt-2"
                    style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                  >
                    {candidate.party}
                  </span>
                  <p className="text-sm text-slate-600 mt-3">Age: {candidate.age}</p>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <button className="btn btn-secondary flex-1" type="button" onClick={() => onEdit(candidate)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger flex-1"
                    type="button"
                    disabled={deletingId === candidate.id}
                    onClick={() => setDeleteTarget(candidate)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete candidate?"
        message={deleteTarget ? `Remove ${deleteTarget.name}? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={Boolean(deletingId)}
      />
    </section>
  );
}
