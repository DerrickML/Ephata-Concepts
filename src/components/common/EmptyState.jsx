export default function EmptyState({ title = "Nothing published yet", message }) {
  return (
    <div className="empty-state">
      <p className="section-kicker">Empty state</p>
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
    </div>
  );
}

