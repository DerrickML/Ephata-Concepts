const steps = [
  {
    title: "Consultation",
    desc: "Clarify the vision, define key milestones, and align on budget scope."
  },
  {
    title: "Concept",
    desc: "Curate design themes, select aesthetics, and align brand style guides."
  },
  {
    title: "Planning",
    desc: "Secure vendor contracts, manage details, and organize guest lists."
  },
  {
    title: "Execution",
    desc: "Direct layout flows, verify timelines, and maintain a calm venue day."
  },
  {
    title: "Reflection",
    desc: "Deliver final reporting, close finances, and review success metrics."
  }
];

export default function ProcessSteps({ items = steps }) {
  const visibleItems = Array.isArray(items) && items.length ? items : steps;
  return (
    <ol className="process-steps">
      {visibleItems.map((step, index) => (
        <li key={`${step.label || step.title}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.label || step.title}</h3>
          <p>{step.text || step.desc}</p>
        </li>
      ))}
    </ol>
  );
}
