import { useShowroomStore, CAMERA_PRESETS, type ScenePreset } from '../store/useShowroomStore';
import styles from './SceneControls.module.css';

export function SceneControls() {
  const scenePreset = useShowroomStore((s) => s.scenePreset);
  const cameraPreset = useShowroomStore((s) => s.cameraPreset);
  const setScenePreset = useShowroomStore((s) => s.setScenePreset);
  const setCameraPreset = useShowroomStore((s) => s.setCameraPreset);

  return (
    <div className={styles.bar} aria-label="Scene controls">
      <div className={styles.group}>
        <span className={styles.label}>Scene</span>
        {(['living', 'bath'] as ScenePreset[]).map((preset) => (
          <button
            key={preset}
            type="button"
            className={`${styles.chip} ${scenePreset === preset ? styles.active : ''}`}
            aria-pressed={scenePreset === preset}
            onClick={() => setScenePreset(preset)}
          >
            {preset === 'living' ? 'Living room' : 'Bathroom'}
          </button>
        ))}
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Camera</span>
        {CAMERA_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`${styles.chip} ${cameraPreset === preset.id ? styles.active : ''}`}
            aria-pressed={cameraPreset === preset.id}
            onClick={() => setCameraPreset(preset.id)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
