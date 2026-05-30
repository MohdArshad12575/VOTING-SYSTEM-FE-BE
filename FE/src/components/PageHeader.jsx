export default function PageHeader({ title, description, action }) {
  return (
    <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
