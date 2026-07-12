import { useVisualizerStore } from '../store/useVisualizerStore';
import type { Tile } from '../types/catalog';
import { DesignGrid } from './DesignGrid';
import { FinishFilter } from './FinishFilter';
import { filterDesigns } from './filterDesigns';
import styles from './CatalogPanel.module.css';

export function CatalogPanel() {
  const designs = useVisualizerStore((s) => s.designs);
  const finishFilter = useVisualizerStore((s) => s.finishFilter);
  const selectedDesign = useVisualizerStore((s) => s.selectedDesign);
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);
  const selectDesign = useVisualizerStore((s) => s.selectDesign);

  const visible = filterDesigns(designs, finishFilter);

  const handleSelect = (design: Tile) => {
    selectDesign(design);
    // Temporary verification log (exit criteria)
    console.log('[catalog] selectDesign', design.id, design.name, design.finish);
  };

  return (
    <section className={styles.panel} aria-label="Tile catalogue">
      <header className={styles.header}>
        <h1 className={styles.title}>Catalogue</h1>
        <p className={styles.count}>
          {visible.length} of {designs.length} designs
        </p>
      </header>

      <FinishFilter />

      {!selectedSurfaceId && (
        <p className={styles.hint} role="status">
          Select a wall or floor in the room, then pick a design.
        </p>
      )}

      {selectedDesign && (
        <p className={styles.active}>
          Selected: <strong>{selectedDesign.name}</strong>
          <span className={styles.activeCode}> · {selectedDesign.id}</span>
        </p>
      )}

      <div className={styles.scroll}>
        <DesignGrid
          designs={visible}
          selectedDesignId={selectedDesign?.id ?? null}
          onSelectDesign={handleSelect}
        />
      </div>
    </section>
  );
}
