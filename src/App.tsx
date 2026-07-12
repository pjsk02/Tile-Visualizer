import { useEffect } from 'react';
import { Experience } from './scene/Experience';
import { DesignCount } from './catalog/DesignCount';
import { useVisualizerStore } from './store/useVisualizerStore';

function App() {
  const designs = useVisualizerStore((s) => s.designs);

  useEffect(() => {
    console.log(`[store] loaded ${designs.length} designs`);
  }, [designs]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Experience />
      <DesignCount />
    </div>
  );
}

export default App;
