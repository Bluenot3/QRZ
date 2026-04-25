import { useState, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export function ApiKeyGate({ children }: { children: ReactNode }) {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.aistudio?.hasSelectedApiKey) {
      window.aistudio.hasSelectedApiKey().then(setHasKey);
    } else {
      // In case we're not in the AI Studio environment, we just let it pass
      // or rely on process.env.GEMINI_API_KEY which is injected by Vite.
      setHasKey(true);
    }
  }, []);

  if (hasKey === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl shadow-xl text-center border border-zinc-800">
          <h1 className="text-2xl font-bold mb-3 tracking-tight">API Key Required</h1>
          <p className="mb-8 text-zinc-400 text-sm leading-relaxed">
            To use the <strong>Nano Banana Pro 2</strong> models for high-quality image generation, 
            you need to select a Google Cloud API Key with billing enabled.
          </p>
          <button 
            onClick={async () => {
              if (window.aistudio?.openSelectKey) {
                await window.aistudio.openSelectKey();
                // We assume success here as per the skills documentation to mitigate race condition
                setHasKey(true);
              }
            }}
            className="w-full px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
          >
            Select API Key
          </button>
          <div className="mt-6 text-xs text-zinc-500">
            For more info on billing, visit <a className="underline hover:text-zinc-300" href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer">Gemini API Billing</a>.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
