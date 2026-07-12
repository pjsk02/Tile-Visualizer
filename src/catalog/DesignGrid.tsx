import type { Tile } from '../types/catalog';
import { DesignCard } from './DesignCard';
import styles from './DesignGrid.module.css';

export interface DesignGridProps {
  designs: Tile[];
  selectedDesignId: string | null;
  appliedDesignIds: Set<string>;
  onSelectDesign: (design: Tile) => void;
}

export function DesignGrid({
  designs,
  selectedDesignId,
  appliedDesignIds,
  onSelectDesign,
}: DesignGridProps) {
  if (designs.length === 0) {
    return (
      <div className={styles.empty} role="status">
        No designs match this finish.
      </div>
    );
  }

  return (
    <div className={styles.grid} role="list">
      {designs.map((design) => (
        <div key={design.id} role="listitem" className={styles.item}>
          <DesignCard
            design={design}
            selected={design.id === selectedDesignId}
            applied={appliedDesignIds.has(design.id)}
            onSelect={onSelectDesign}
          />
        </div>
      ))}
    </div>
  );
}
