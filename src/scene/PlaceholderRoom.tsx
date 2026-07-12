/**
 * Non-interactive spatial context while the FlashWorld .ply is absent.
 * Not retextured — tile application lives on inserted panels in src/panels/.
 */
export function PlaceholderRoom() {
  return (
    <group>
      <mesh position={[0, 4, 0]} raycast={() => null}>
        <boxGeometry args={[10, 8, 10]} />
        <meshStandardMaterial color="#1c1f28" wireframe transparent opacity={0.35} />
      </mesh>
      {/* Soft fill so empty corners read as a room volume */}
      <mesh position={[0, 4, 0]} raycast={() => null}>
        <boxGeometry args={[9.8, 7.8, 9.8]} />
        <meshStandardMaterial color="#2a2e3a" transparent opacity={0.15} side={1} />
      </mesh>
    </group>
  );
}
