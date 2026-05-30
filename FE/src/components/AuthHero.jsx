export default function AuthHero({ headline, subtext }) {
  return (
    <aside className="auth-hero">
      <div className="auth-hero-content">
        <div className="mb-8 text-5xl animate-float" aria-hidden="true">
          🗳️
        </div>
        <h2>{headline}</h2>
        <p>{subtext}</p>
      </div>
    </aside>
  );
}
