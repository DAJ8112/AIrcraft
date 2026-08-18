function railState(done, active) {
  if (active) return 'is-active';
  if (done) return 'is-done';
  return 'is-pending';
}

export default function StatusRail({ hasFile, hasAnalytics, hasRecommendation, loadingPhase }) {
  const stages = [
    { index: '01', label: 'Intake', state: railState(hasFile || hasAnalytics, false) },
    { index: '02', label: 'Analytics', state: railState(hasAnalytics, loadingPhase === 'analytics') },
    { index: '03', label: 'Guidance', state: railState(hasRecommendation, loadingPhase === 'ai') },
  ];

  return (
    <section className="status-rail" aria-label="Pipeline status">
      {stages.map((stage) => (
        <div key={stage.index} className={`rail-cell ${stage.state}`}>
          <span className="rail-index">{stage.index}</span>
          <span className="rail-label">{stage.label}</span>
          <span className="rail-state">
            <span className="led" aria-hidden="true" />
            {stage.state === 'is-done' ? <span className="rail-ok">OK</span> : null}
          </span>
        </div>
      ))}
    </section>
  );
}
