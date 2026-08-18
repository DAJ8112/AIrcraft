import PanelFrame from './PanelFrame';

export default function GuidancePanel({ manualFile, onFileChange, onGenerate, disabled, isLoading, loadingPhase }) {
  return (
    <PanelFrame index="2" code="//005/" title="Maintenance Guidance">
      <div className="panel-stack">
        <label className="file-field">
          <span>Input // Maintenance Manual .pdf</span>
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
        </label>

        <p className="helper-text">
          {manualFile ? `STAGED: ${manualFile.name}` : 'STAGED LOCALLY — NOT LINKED TO ANALYSIS'}
        </p>

        <button className="btn" onClick={onGenerate} disabled={disabled}>
          {isLoading && loadingPhase === 'ai' ? 'Running AI analysis...' : '▸ Run AI Analysis'}
        </button>
      </div>
    </PanelFrame>
  );
}
