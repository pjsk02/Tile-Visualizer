import type { Tile } from '../types/catalog';
import type { FinishFilter } from '../store/useVisualizerStore';

export function filterDesigns(designs: Tile[], finishFilter: FinishFilter): Tile[] {
  if (finishFilter === 'all') return designs;
  return designs.filter((d) => d.finish === finishFilter);
}
