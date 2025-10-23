"use client";
import ErrorPage from "./portal/_components/ErrorPage";

export default function GlobalError({ error, reset }) {
  console.error('Global error:', error);

  const getErrorType = () => {
    if (error?.message?.includes('404')) return '404';
    if (error?.message?.includes('500')) return '500';
    if (error?.message?.includes('403')) return '403';
    if (error?.message?.includes('network')) return 'network';
    return '500';
  };

  const customActions = (
    <div className="error-actions">
      <button 
        className="btn btn-outline-secondary me-2"
        onClick={() => window.history.back()}
      >
        ← Go Back
      </button>
      <button 
        className="btn btn-outline-primary me-2"
        onClick={reset}
      >
        🔄 Try Again
      </button>
      <a 
        href="/portal/dashboard"
        className="btn btn-primary"
      >
        🏠 Go to Portal
      </a>
    </div>
  );

  return (
    <ErrorPage
      errorType={getErrorType()}
      title="Application Error"
      message="An unexpected error occurred in the application. Our team has been notified and is working to fix it."
      showRetry={false}
      showHome={false}
      customActions={customActions}
    />
  );
}
