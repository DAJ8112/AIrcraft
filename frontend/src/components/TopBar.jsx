import ThemeToggle from './ThemeToggle';

export default function TopBar({ status, healthOk, theme, onThemeChange }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="brand-name">Aerocare</span>
        <span className="brand-sub">// MAINTENANCE OPS</span>
      </div>
      <div className="topbar-status">
        <ThemeToggle theme={theme} onChange={onThemeChange} />
        <span className="api-label">API :8000</span>
        <span className={`link-status ${healthOk ? 'online' : 'offline'}`} title={status}>
          <span className={`led lit${healthOk ? ' blink' : ''}`} aria-hidden="true" />
          <span className="link-label">{healthOk ? 'LINK ONLINE' : 'LINK OFFLINE'}</span>
        </span>
      </div>
    </header>
  );
}
