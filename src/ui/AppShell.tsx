import { useState, type ReactNode } from 'react';
import { CatalogPanel } from '../catalog/CatalogPanel';
import { SceneControls } from './SceneControls';
import styles from './AppShell.module.css';

type AppShellProps = {
  /** 3D canvas slot — App root passes Experience; this file never imports scene. */
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <SceneControls />
      <main className={styles.canvasSlot}>{children}</main>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={catalogOpen}
        aria-controls="catalog-drawer"
        onClick={() => setCatalogOpen((open) => !open)}
      >
        {catalogOpen ? 'Hide catalogue' : 'Catalogue'}
      </button>

      {catalogOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close catalogue"
          onClick={() => setCatalogOpen(false)}
        />
      )}

      <aside
        id="catalog-drawer"
        className={`${styles.catalogSlot} ${catalogOpen ? styles.catalogOpen : ''}`}
      >
        <CatalogPanel />
      </aside>
    </div>
  );
}
