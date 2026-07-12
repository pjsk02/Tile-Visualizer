import { useState } from 'react';
import type { Tile } from '../types/catalog';
import styles from './DesignCard.module.css';

export interface DesignCardProps {
  design: Tile;
  selected: boolean;
  applied: boolean;
  onSelect: (design: Tile) => void;
}

export function DesignCard({ design, selected, applied, onSelect }: DesignCardProps) {
  const [preview, setPreview] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(design)}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      onFocus={() => setPreview(true)}
      onBlur={() => setPreview(false)}
    >
      <div className={styles.thumbWrap}>
        <img
          className={styles.thumb}
          src={`/${preview ? design.lifestyle_path : design.thumbnail_path}`}
          alt=""
          loading="lazy"
          decoding="async"
          width={120}
          height={180}
        />
        {applied && <span className={styles.appliedBadge}>Applied</span>}
        <span className={styles.finishChip}>{design.finish}</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.code}>{design.id}</span>
        <span className={styles.name}>{design.name}</span>
      </div>
    </button>
  );
}
