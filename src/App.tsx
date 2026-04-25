import { useEffect, useState } from 'react';
import { ApiKeyGate } from './components/ApiKeyGate';
import { GeneratorView } from './components/GeneratorView';
import { ScanView } from './components/ScanView';

export default function App() {
  const [view, setView] = useState<'app' | 'scan'>('app');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('scan') === 'true') {
      setView('scan');
    }
  }, []);

  if (view === 'scan') {
    return <ScanView />;
  }

  return (
    <ApiKeyGate>
      <GeneratorView />
    </ApiKeyGate>
  );
}
