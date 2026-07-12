import { useEffect, useState } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import type { Finish, Tile } from '../types/catalog';

/**
 * Dev A verification harness — keyboard shortcuts until Dev B catalogue UI lands.
 * 1 / 2 / 3  → select first three catalogue designs onto the active surface
 * G / M      → re-apply active design with glossy / matte finish override
 * Escape     → clear selected design
 */
export function DesignProbe() {
  const selectedDesign = useVisualizerStore((s) => s.selectedDesign);
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);
  const [hint, setHint] = useState(
    'Click a wall/floor, then press 1–3 to apply a tile. G/M toggles glossy/matte.',
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { designs, selectedDesign: current, selectDesign } = useVisualizerStore.getState();

      if (e.key === '1' || e.key === '2' || e.key === '3') {
        const idx = Number(e.key) - 1;
        const design = designs[idx];
        if (design) {
          selectDesign(design);
          setHint(`Design ${e.key}: ${design.name} (${design.finish})`);
          console.log(`[DesignProbe] selected design ${e.key}:`, design.id, design.finish);
        }
        return;
      }

      if (e.key === 'g' || e.key === 'G' || e.key === 'm' || e.key === 'M') {
        const base = current ?? designs[0];
        if (!base) return;
        const finish: Finish = e.key.toLowerCase() === 'm' ? 'matte' : 'glossy';
        const overridden: Tile = { ...base, finish };
        selectDesign(overridden);
        setHint(`Finish → ${finish} on ${base.name}`);
        console.log(`[DesignProbe] finish override → ${finish} on`, base.id);
        return;
      }

      if (e.key === 'Escape') {
        selectDesign(null);
        setHint('Design cleared. Click a surface, then press 1–3.');
        console.log('[DesignProbe] cleared design');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        bottom: 12,
        width: 'auto',
        height: 'auto',
        maxWidth: 360,
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.55)',
        color: '#e8eaef',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 12,
        lineHeight: 1.45,
        borderRadius: 6,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div>{hint}</div>
      <div style={{ opacity: 0.75, marginTop: 4 }}>
        surface: {selectedSurfaceId ?? 'none'}
        {selectedDesign ? ` · ${selectedDesign.id} (${selectedDesign.finish})` : ''}
      </div>
    </div>
  );
}
