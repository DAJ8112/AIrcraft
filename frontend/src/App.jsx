import { useEffect, useState } from 'react';
import { getMaintenanceRecommendation, healthCheck, uploadAnalyticsFile } from './api/client';
import TopBar from './components/TopBar';
import StatusRail from './components/StatusRail';
import UploadPanel from './components/UploadPanel';
import GuidancePanel from './components/GuidancePanel';
import MetricGrid from './components/MetricGrid';
import AnalyticsPanel from './components/AnalyticsPanel';
import RecommendationReport from './components/RecommendationReport';

// Must match the key used by the theme bootstrap script in index.html.
const THEME_KEY = 'aircraft-theme';

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [manualFile, setManualFile] = useState(null);
  const [status, setStatus] = useState('Checking backend connection...');
  const [healthOk, setHealthOk] = useState(false);
  // The bootstrap script already resolved stored choice vs. system preference.
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const result = await healthCheck();
        setStatus(`Backend online · ${result.service || 'API ready'}`);
        setHealthOk(true);
      } catch (err) {
        setStatus('Backend offline. Start FastAPI on port 8000.');
        setHealthOk(false);
        setError(err.message);
      }
    };

    pingBackend();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Storage unavailable — the choice just won't survive a reload.
    }
  }, [theme]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!excelFile) {
      setError('Please upload an Excel file first.');
      return;
    }

    setIsLoading(true);
    setLoadingPhase('analytics');
    setError('');
    setRecommendation(null);

    try {
      const response = await uploadAnalyticsFile(excelFile);
      setAnalyticsResult(response);
      setStatus(`Analytics ready for ${response.aircraft_id || 'selected aircraft'}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  const handleRecommendation = async () => {
    if (!analyticsResult) {
      setError('Generate analytics first.');
      return;
    }

    setIsLoading(true);
    setLoadingPhase('ai');
    setError('');

    try {
      const response = await getMaintenanceRecommendation(analyticsResult);
      setRecommendation(response);
      setStatus('AI maintenance recommendation generated');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="app-shell">
      <TopBar status={status} healthOk={healthOk} theme={theme} onThemeChange={setTheme} />

      <StatusRail
        hasFile={Boolean(excelFile)}
        hasAnalytics={Boolean(analyticsResult)}
        hasRecommendation={Boolean(recommendation)}
        loadingPhase={loadingPhase}
      />

      <div className="dashboard-grid">
        <aside className="sidebar">
          <UploadPanel
            onFileChange={setExcelFile}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            loadingPhase={loadingPhase}
          />
          <GuidancePanel
            manualFile={manualFile}
            onFileChange={setManualFile}
            onGenerate={handleRecommendation}
            disabled={isLoading || !analyticsResult}
            isLoading={isLoading}
            loadingPhase={loadingPhase}
          />
        </aside>

        <main className="main-content">
          <MetricGrid analyticsResult={analyticsResult} />

          {error ? (
            <div className="error-line">
              <span className="led lit blink" aria-hidden="true" />
              ERR // {error}
            </div>
          ) : null}

          <div className="split-view">
            <AnalyticsPanel analyticsResult={analyticsResult} isLoading={isLoading && loadingPhase === 'analytics'} />
            <RecommendationReport report={recommendation?.report || null} isLoading={isLoading && loadingPhase === 'ai'} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
