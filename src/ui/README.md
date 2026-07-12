Owner: **Dev B**

App chrome around the 3D view. `AppShell` lays out the canvas slot (`children`) beside the
catalogue panel — it never imports from `src/scene` or `src/panels`. Composition happens
at the app root (`App.tsx` passes `<Experience />` as the slot).
