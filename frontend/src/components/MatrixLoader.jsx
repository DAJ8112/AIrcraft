export default function MatrixLoader({ label = 'PROCESSING', tone = 'green', idle = false }) {
  return (
    <div className={`matrix-loader tone-${tone}${idle ? ' is-idle' : ''}`} role="status" aria-live="polite">
      <div className="matrix-grid" aria-hidden="true">
        {Array.from({ length: 25 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="matrix-label">
        {label}
        {!idle && <span className="matrix-cursor">▌</span>}
      </span>
    </div>
  );
}
