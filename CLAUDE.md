@AGENTS.md

## Solo para Claude Code

- Responde siempre en español.
- Antes de modificar código, explica la justificación y el plan, y espera aprobación.
- Trabaja por fases; al terminar cada una verifica (`npx tsc --noEmit`, lint sin errores nuevos, `npm run build`).
- No hagas commits: los hace el usuario.
