import { useMemo } from 'react';

export default function MetricGrid({ analyticsResult }) {
  const metrics = useMemo(() => {
    if (!analyticsResult?.summary) return [];

    const summary = analyticsResult.summary;
    const analysis = summary.historical_analysis || [];
    const riskSignal = analysis.find((item) => item.column === 'Risk_Score');
    const vibrationSignal = analysis.find((item) => item.column === 'Engine_Vibration');
    const rulSignal = analysis.find((item) => item.column === 'Remaining_Useful_Life');
    const record = summary.current_record || {};

    return [
      {
        code: 'A/C',
        label: 'Aircraft',
        value: analyticsResult.aircraft_id || 'N/A',
        sub: record.Aircraft_Model || 'Unknown model',
        tone: 'neutral',
      },
      {
        code: 'ENG',
        label: 'Engine',
        value: record.Engine_Model || 'N/A',
        sub: `APT ${record.Airport_Code || 'N/A'}`,
        tone: 'neutral',
      },
      {
        code: 'CYC',
        label: 'Flight Cycle',
        value: summary.latest_flight_cycle || 'N/A',
        sub: `${record.Flight_Hours || 0} flight hours logged`,
        tone: 'neutral',
      },
      {
        code: 'OVH',
        label: 'Since Overhaul',
        value: record.Cycles_Since_Overhaul || 'N/A',
        sub: `Last maint ${record.Last_Maintenance_Date || 'N/A'}`,
        tone: 'neutral',
      },
      {
        code: 'RSK',
        label: 'Risk Score',
        value: riskSignal ? riskSignal.latest_value : 'N/A',
        sub: riskSignal ? `${riskSignal.change_percent > 0 ? '+' : ''}${riskSignal.change_percent.toFixed(1)}% vs history` : '',
        tone: riskSignal && riskSignal.latest_value > 70 ? 'red' : riskSignal && riskSignal.latest_value > 50 ? 'amber' : 'green',
      },
      {
        code: 'RUL',
        label: 'Remaining Life',
        value: rulSignal ? `${rulSignal.latest_value}` : 'N/A',
        sub: rulSignal ? `cycles / ${rulSignal.change_percent > 0 ? '+' : ''}${rulSignal.change_percent.toFixed(1)}% vs avg` : '',
        tone: rulSignal && rulSignal.latest_value < 30 ? 'red' : rulSignal && rulSignal.latest_value < 50 ? 'amber' : 'green',
      },
      {
        code: 'VIB',
        label: 'Vibration',
        value: vibrationSignal ? `${vibrationSignal.latest_value}` : 'N/A',
        sub: vibrationSignal ? `mm/s / ${vibrationSignal.trend_direction}` : '',
        tone: vibrationSignal && vibrationSignal.trend_direction === 'INCREASING' ? 'amber' : 'neutral',
      },
      {
        code: 'SIG',
        label: 'Signals',
        value: analysis.length,
        sub: `Window ${summary.historical_window_size || 10} cycles`,
        tone: 'neutral',
      },
      {
        code: 'AMB',
        label: 'Ambient',
        value: `${record.Ambient_Temperature?.toFixed(1) || 'N/A'}°C`,
        sub: `Humidity ${record.Humidity || 'N/A'}%`,
        tone: 'neutral',
      },
    ];
  }, [analyticsResult]);

  if (metrics.length === 0) return null;

  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div className={`metric-cell${metric.tone !== 'neutral' ? ` tone-${metric.tone}` : ''}`} key={metric.code} title={metric.label}>
          <div className="metric-top">
            <span className="metric-code">{metric.code}</span>
            <span className="led" aria-hidden="true" />
          </div>
          <strong className="metric-value">{metric.value}</strong>
          <small className="metric-sub">{metric.sub}</small>
        </div>
      ))}
    </div>
  );
}
