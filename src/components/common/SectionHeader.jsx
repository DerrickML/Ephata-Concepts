export default function SectionHeader({ eyebrow, title, intro, align = "left" }) {
  return (
    <div className={`section-header section-header-${align}`}>
      {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
      <h2 className="heading-serif">{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}

