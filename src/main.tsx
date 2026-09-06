import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App.tsx'
import './index.css'

function ErrorFallback({ error }: { error: any }) {
  return (
    <div role="alert" className="p-8 text-red-600 bg-red-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong:</h2>
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <pre className="text-sm mt-4 text-slate-500 whitespace-pre-wrap">{error.stack}</pre>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
