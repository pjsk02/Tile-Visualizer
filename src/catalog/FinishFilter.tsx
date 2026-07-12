import { useVisualizerStore, type FinishFilter } from '../store/useVisualizerStore';
import styles from './FinishFilter.module.css';

const OPTIONS: { value: FinishFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'matte', label: 'Matte' },
  { value: 'random', label: 'Random' },
];

export function FinishFilter() {
  const finishFilter = useVisualizerStore((s) => s.finishFilter);
  const setFinishFilter = useVisualizerStore((s) => s.setFinishFilter);

  return (
    <div className={styles.bar} role="tablist" aria-label="Filter by finish">
      {OPTIONS.map((opt) => {
        const selected = finishFilter === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            className={`${styles.tab} ${selected ? styles.active : ''}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setFinishFilter(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
