import ButtonLink from "@/components/common/ButtonLink.jsx";

export default function CTASection({
  title = "Ready for a calmer event?",
  body = "Tell us what you are planning. We will shape the next step.",
  align = "left"
}) {
  return (
    <section className={`cta-section cta-${align}`}>
      <div className="shell cta-inner">
        <div>
          <p className="section-kicker">Book Consultation</p>
          <h2 className="heading-serif">{title}</h2>
          <p>{body}</p>
        </div>
        <ButtonLink href="/book-consultation">Start</ButtonLink>
      </div>
    </section>
  );
}
