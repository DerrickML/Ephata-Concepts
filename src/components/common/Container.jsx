export default function Container({ children, className = "" }) {
  return <div className={`shell ${className}`}>{children}</div>;
}
