import ButtonLink from "@/components/common/ButtonLink.jsx";

export default function CTASection({
  eyebrow = "Book Consultation",
  title = "Ready for a calmer event?",
  body = "Tell us what you are planning. We will shape the next step.",
  buttonLabel = "Start",
  buttonHref = "/book-consultation",
  align = "left"
}) {
  return (
    <section className={`cta-section cta-${align}`}>
      <div className="shell cta-inner">
        <div>
          <p className="section-kicker">{eyebrow}</p>
          <h2 className="heading-serif">{title}</h2>
          <p>{body}</p>
        </div>
        <ButtonLink href={buttonHref}>{buttonLabel}</ButtonLink>
      </div>
    </section>
  );
}
