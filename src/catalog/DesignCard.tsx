import type { Tile } from '../types/catalog';
import styles from './DesignCard.module.css';

export interface DesignCardProps {
  design: Tile;
  selected: boolean;
  onSelect: (design: Tile) => void;
}

export function DesignCard({ design, selected, onSelect }: DesignCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(design)}
    >
      <div className={styles.thumbWrap}>
        <img
          className={styles.thumb}
          src={`/${design.thumbnail_path}`}
          alt=""
          loading="lazy"
          decoding="async"
          width={120}
          height={180}
        />
      </div>
      <div className={styles.meta}>
        <span className={styles.code}>{design.id}</span>
        <span className={styles.name}>{design.name}</span>
      </div>
    </button>
  );
}
