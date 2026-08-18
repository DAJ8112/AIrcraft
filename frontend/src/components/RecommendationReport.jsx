import PanelFrame from './PanelFrame';
import StatusTag from './StatusTag';
import MatrixLoader from './MatrixLoader';

function healthTone(status) {
  switch (status?.toUpperCase()) {
    case 'OK':
    case 'NORMAL': return 'green';
    case 'CRITICAL':
    case 'ALERT': return 'red';
    case 'MONITOR':
    default: return 'amber';
  }
}

function riskTone(level) {
  switch (level?.toUpperCase()) {
    case 'LOW': return 'green';
    case 'HIGH': return 'red';
    case 'MEDIUM':
    default: return 'amber';
  }
}

function priorityClass(priority) {
  if (priority === 1 || priority === '1') return 'p1';
  if (priority === 2 || priority === '2') return 'p2';
  return '';
}

function ManualRef({ reference }) {
  if (!reference) return null;
  return (
    <span className="manual-ref">
      <span className="prefix">REF </span>
      {reference}
    </span>
  );
}

function FlightDecision({ decision }) {
  if (!decision) return null;
  const go = decision.can_fly_now;
  return (
    <div className={`decision-block ${go ? 'go' : 'no-go'}`}>
      <div className="decision-main">
        <span className="decision-board">{go ? 'GO' : 'NO-GO'}</span>
        <div className="decision-info">
          <div className="decision-title">{decision.decision?.replace(/_/g, ' ')}</div>
          <div className="decision-req">REQ BEFORE NEXT FLIGHT: {decision.required_before_next_flight}</div>
        </div>
      </div>
      <div className="decision-statement">{decision.ui_statement}</div>
      {decision.decision_rationale && (
        <div className="decision-rationale">
          <span className="prefix">RATIONALE // </span>
          {decision.decision_rationale}
        </div>
      )}
    </div>
  );
}

function ViolationList({ violations }) {
  if (!violations?.length) return null;
  return (
    <div>
      <div className="section-head tone-red">
        <span className="led" aria-hidden="true" />
        Threshold Violations
        <span className="section-count">N={violations.length}</span>
      </div>
      <div className="violation-grid">
        {violations.map((v, i) => (
          <div className="violation-card" key={i}>
            <div className="violation-header">
              <span className="violation-param">{v.parameter?.replace(/_/g, ' ')}</span>
              <StatusTag tone="red">{v.severity}</StatusTag>
            </div>
            <div className="violation-values">
              <div className="violation-val">
                <label>Observed</label>
                <span className="observed">{v.observed_value}</span>
              </div>
              <div className="violation-val">
                <label>Threshold</label>
                <span>{v.manual_threshold}</span>
              </div>
            </div>
            {v.explanation && <div className="violation-explanation">{v.explanation}</div>}
            <ManualRef reference={v.manual_reference} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RootCause({ rootCause }) {
  if (!rootCause) return null;
  return (
    <div>
      <div className="section-head">
        <span className="led" aria-hidden="true" />
        Root Cause
      </div>
      <div className="cause-title">{rootCause.most_likely_cause}</div>
      <ul className="evidence-list">
        {(rootCause.supporting_evidence || []).map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
      <ManualRef reference={rootCause.manual_reference} />
    </div>
  );
}

function ActionList({ actions }) {
  if (!actions?.length) return null;
  return (
    <div>
      <div className="section-head">
        <span className="led" aria-hidden="true" />
        Maintenance Actions
        <span className="section-count">N={actions.length}</span>
      </div>
      {actions.map((action, i) => (
        <div className="action-item" key={i}>
          <span className={`action-priority ${priorityClass(action.priority)}`}>P{action.priority}</span>
          <div className="action-content">
            <div className="action-text">{action.action}</div>
            <div className="action-reason">{action.reason}</div>
            <ManualRef reference={action.manual_reference} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Checklist({ items }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="section-head">
        <span className="led" aria-hidden="true" />
        Inspection Checklist
        <span className="section-count">N={items.length}</span>
      </div>
      {items.map((item, i) => (
        <div className="checklist-item" key={i}>
          <span className="checklist-step">{item.step}</span>
          <div className="checklist-content">
            <div className="check-title">{item.inspection_item}</div>
            <div className="check-criteria">
              <span className="prefix">ACC: </span>
              {item.acceptance_criteria}
            </div>
            <ManualRef reference={item.manual_reference} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfidenceRow({ confidence, workOrder }) {
  return (
    <div className="info-row">
      <div className="info-card tone-blue">
        <span className="info-label">AI Confidence</span>
        <span className="info-value">
          {confidence?.score ? `${(confidence.score * 100).toFixed(0)}%` : 'N/A'}
        </span>
        <div className="confidence-track">
          <div className="confidence-fill" style={{ width: `${(confidence?.score || 0) * 100}%` }} />
        </div>
        {confidence?.rationale && <span className="info-sub">{confidence.rationale}</span>}
      </div>
      <div className="info-card">
        <span className="info-label">Work Order Type</span>
        <span className="info-value">{workOrder?.work_order_type || 'N/A'}</span>
        <span className="info-sub">Priority: {workOrder?.priority || 'N/A'}</span>
        <span className="info-sub">{workOrder?.estimated_maintenance_category || ''}</span>
      </div>
    </div>
  );
}

function WorkOrder({ workOrder }) {
  if (!workOrder) return null;
  return (
    <div className="work-order">
      <div className="wo-title">
        <span className="prefix">WORK ORDER // </span>
        {workOrder.title}
      </div>
      <div className="wo-meta">
        <div className="wo-meta-item">
          <label>Aircraft</label>
          <span>{workOrder.aircraft_id}</span>
        </div>
        <div className="wo-meta-item">
          <label>Category</label>
          <span>{workOrder.estimated_maintenance_category}</span>
        </div>
      </div>

      {workOrder.tasks?.length > 0 && (
        <ul className="wo-tasks">
          {workOrder.tasks.map((task, i) => (
            <li key={i}>{task}</li>
          ))}
        </ul>
      )}

      {workOrder.required_parts_or_tools?.length > 0 && (
        <div className="wo-parts">
          {workOrder.required_parts_or_tools.map((part, i) => (
            <span className="wo-part-chip" key={i}>{part}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function MissingInfo({ items }) {
  if (!items?.length) return null;
  return (
    <div className="missing-data">
      <div className="section-head tone-amber">
        <span className="led" aria-hidden="true" />
        Missing Data
      </div>
      <ul>
        {items.map((info, i) => (
          <li key={i}>{info}</li>
        ))}
      </ul>
    </div>
  );
}

export default function RecommendationReport({ report, isLoading }) {
  return (
    <PanelFrame
      index="B"
      code="//004/"
      title="AI Maintenance Recommendation"
      headerRight={<StatusTag tone="blue">AI</StatusTag>}
    >
      {isLoading ? (
        <MatrixLoader tone="blue" label="Running AI analysis" />
      ) : report ? (
        <div className="report">
          <div className="report-ident">
            <span className="report-ident-label">AI Analysis</span>
            <span className="report-ident-sub">
              {report.aircraft} · {report.aircraft_model}
            </span>
          </div>

          <div className="status-banner">
            <StatusTag tone={healthTone(report.health_status)}>{report.health_status}</StatusTag>
            <StatusTag tone={riskTone(report.risk_level)}>{report.risk_level} RISK</StatusTag>
            <StatusTag tone={report.safe_for_next_flight ? 'green' : 'red'}>
              {report.safe_for_next_flight ? 'SAFE FOR FLIGHT' : 'GROUND AIRCRAFT'}
            </StatusTag>
          </div>

          {report.overall_summary && (
            <div className="summary-box">
              <span className="box-label">Summary</span>
              <p>{report.overall_summary}</p>
            </div>
          )}

          <FlightDecision decision={report.final_flight_decision} />
          <ViolationList violations={report.threshold_violations} />
          <RootCause rootCause={report.root_cause} />
          <ActionList actions={report.maintenance_actions} />
          <Checklist items={report.inspection_checklist} />
          <ConfidenceRow confidence={report.confidence} workOrder={report.work_order} />
          <WorkOrder workOrder={report.work_order} />
          <MissingInfo items={report.confidence?.missing_information} />
        </div>
      ) : (
        <MatrixLoader idle label="Awaiting analysis // run AI analysis to generate report" />
      )}
    </PanelFrame>
  );
}
