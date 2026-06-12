export default function PageHeader({ label, title, intro, align = "left" }) {
  return (
    <section className={`page-header page-header-${align}`}>
      <div className="shell">
        <div className="page-header-copy">
          {label ? <p className="section-kicker">{label}</p> : null}
          <h1 className="heading-serif">{title}</h1>
          {intro ? <p>{intro}</p> : null}
        </div>
      </div>
    </section>
  );
}
