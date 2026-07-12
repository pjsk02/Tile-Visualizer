import { useVisualizerStore } from '../store/useVisualizerStore';

// STUB(Dev B): temporary proof that catalog.json is wired through the store.
// Replace with the real thumbnail grid + finish filter UI (see PRD §8, §9).
export function DesignCount() {
  const designs = useVisualizerStore((s) => s.designs);
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 13,
        borderRadius: 6,
      }}
    >
      <div>{designs.length} designs loaded</div>
      <div>selected surface: {selectedSurfaceId ?? 'none'}</div>
    </div>
  );
}
