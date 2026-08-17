import { useMemo } from 'react';
import PanelFrame from './PanelFrame';
import MatrixLoader from './MatrixLoader';
import SignalTable from './SignalTable';

function getGaugeLevel(value, warn, max) {
  const pct = (value / max) * 100;
  if (value >= warn) return 'level-warn';
  if (pct > 85) return 'level-danger';
  return 'level-ok';
}

export default function AnalyticsPanel({ analyticsResult, isLoading }) {
  const currentRecord = analyticsResult?.summary?.current_record;
  const historicalAnalysis = analyticsResult?.summary?.historical_analysis || [];

  const engineGauges = useMemo(() => {
    if (!currentRecord) return [];
    return [
      { label: 'Engine Temp', value: currentRecord.Engine_Temperature, unit: '°C', max: 900, warn: 750 },
      { label: 'EGT', value: currentRecord.Exhaust_Gas_Temperature, unit: '°C', max: 850, warn: 700 },
      { label: 'Oil Temp', value: currentRecord.Oil_Temperature, unit: '°C', max: 150, warn: 110 },
      { label: 'Oil Pressure', value: currentRecord.Oil_Pressure, unit: 'psi', max: 65, warn: 45 },
      { label: 'Engine RPM', value: currentRecord.Engine_RPM, unit: 'RPM', max: 12000, warn: 10500 },
      { label: 'Fuel Flow', value: currentRecord.Fuel_Flow, unit: 'kg/h', max: 3200, warn: 2800 },
      { label: 'Compressor', value: currentRecord.Compressor_Pressure, unit: 'psi', max: 55, warn: 48 },
      { label: 'Hydraulic', value: currentRecord.Hydraulic_Pressure, unit: 'psi', max: 3500, warn: 3200 },
    ];
  }, [currentRecord]);

  return (
    <PanelFrame index="A" code="//003/" title="Engineering Analytics" tone="green">
      {isLoading ? (
        <MatrixLoader tone="green" label="Processing telemetry" />
      ) : analyticsResult ? (
        <div className="analytics-panel">
          <div className="ident-strip">
            <div className="ident-title">
              A/C {analyticsResult.aircraft_id} — {currentRecord?.Aircraft_Model || 'Unknown'}
            </div>
            <div className="ident-meta">
              ENG {currentRecord?.Engine_Model || 'N/A'} / APT {currentRecord?.Airport_Code || 'N/A'} / CYC{' '}
              {analyticsResult.summary.latest_flight_cycle}
            </div>
          </div>

          <div className="gauge-grid">
            {engineGauges.map((gauge) => {
              const pct = Math.min(((gauge.value || 0) / gauge.max) * 100, 100);
              const level = getGaugeLevel(gauge.value || 0, gauge.warn, gauge.max);
              const warnPct = (gauge.warn / gauge.max) * 100;
              return (
                <div className="gauge-cell" key={gauge.label}>
                  <span className="gauge-label">{gauge.label}</span>
                  <div className="gauge-value-row">
                    <span className="gauge-value">{gauge.value?.toLocaleString() || 'N/A'}</span>
                    <span className="gauge-unit">{gauge.unit}</span>
                  </div>
                  <div className="gauge-track">
                    <div className={`gauge-fill ${level}`} style={{ width: `${pct}%` }} />
                    <div className="gauge-tick" style={{ left: `${warnPct}%` }} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          <SignalTable signals={historicalAnalysis} />
        </div>
      ) : (
        <MatrixLoader idle label="Awaiting telemetry // upload .xlsx to begin" />
      )}
    </PanelFrame>
  );
}
