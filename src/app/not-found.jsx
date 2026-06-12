import TransitionLink from "@/components/common/TransitionLink.jsx";

export default function NotFound() {
  return (
    <section className="page-shell not-found-section">
      <div className="shell">
        <div className="narrow-copy">
          <p className="section-kicker">Page not found</p>
          <h1 className="heading-serif">This page is not available.</h1>
          <p>The content may have moved or may not be published yet.</p>
          <div className="button-row">
            <TransitionLink className="btn-brand" href="/">
              Return Home
            </TransitionLink>
            <TransitionLink className="btn-outline-brand" href="/services">
              Explore Services
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
