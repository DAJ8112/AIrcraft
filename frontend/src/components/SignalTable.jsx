function getTrendGlyph(direction) {
  switch (direction) {
    case 'INCREASING': return '▲';
    case 'DECREASING': return '▼';
    case 'STABLE': return '■';
    default: return '·';
  }
}

export default function SignalTable({ signals }) {
  return (
    <div className="signal-table">
      <div className="section-head">
        <span className="led" aria-hidden="true" />
        Signal Trends
        <span className="section-count">N={signals.length}</span>
      </div>
      <div className="signal-head">
        <span>Parameter</span>
        <span>Current</span>
        <span>Δ%</span>
        <span>Trend</span>
      </div>
      {signals.map((item) => (
        <div key={item.column} className="signal-row">
          <span className="signal-name">{item.column.replace(/_/g, ' ')}</span>
          <span className="signal-value">{item.latest_value.toLocaleString()}</span>
          <span className="signal-change">
            {item.change_percent > 0 ? '+' : ''}{item.change_percent.toFixed(1)}%
          </span>
          <span className="signal-trend">
            {getTrendGlyph(item.trend_direction)} {item.trend_direction}
          </span>
        </div>
      ))}
    </div>
  );
}
