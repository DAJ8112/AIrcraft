export default function StatusTag({ tone = 'neutral', blink = false, children }) {
  return (
    <span className={`status-tag tone-${tone}${blink ? ' blink' : ''}`}>
      <span className="tag-swatch" aria-hidden="true" />
      {children}
    </span>
  );
}
