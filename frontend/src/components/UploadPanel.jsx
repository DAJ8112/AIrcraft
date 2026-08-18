import PanelFrame from './PanelFrame';

export default function UploadPanel({ onFileChange, onSubmit, isLoading, loadingPhase }) {
  return (
    <PanelFrame index="1" code="//002/" title="Flight Data Intake">
      <form onSubmit={onSubmit} className="upload-form">
        <label className="file-field">
          <span>Input // Telemetry .xlsx</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </label>

        <p className="helper-text">
          Latest landed-flight telemetry is compared against the historical baseline to derive current
          aircraft condition.
        </p>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading && loadingPhase === 'analytics' ? 'Running analytics...' : '▸ Run Analytics'}
        </button>
      </form>
    </PanelFrame>
  );
}
