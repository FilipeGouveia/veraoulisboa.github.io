# Exercise schema

Each exercise is a plain object registered via `window.exerciseTopics.push({ id, title, exercises: [...] })`.

The canonical order lives in `assets/app/curriculum.js`. Interactive variants in `assets/exercises/07-interativo.js` override earlier definitions by **id** (loaded last).

## Required fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique slug (kebab-case) |
| `title` | `string` | Display title |
| `points` | `number` | Score awarded on first success |
| `instructions` | `string[]` | Objective bullets (markdown-lite: `[code]`) |
| `starter` | `string` | Initial editor code |
| `validate` | `(code, state) => boolean` | Returns true when exercise is complete |

## Common optional fields

| Field | Type | Description |
|-------|------|-------------|
| `explanation` | `string[]` | Briefing paragraphs |
| `advanced` | `string[]` | Optional deeper "Avançado" paragraphs, shown collapsed behind a toggle button for curious students |
| `curiosity` | `string[]` | Optional "Curiosidade!" paragraphs (fun facts / context), shown as a collapsed section |
| `animation` | `string` | Optional self-contained HTML (with scoped `<style>` / CSS `@keyframes`) showing an animated diagram of the concept; rendered in a `.concept-anim` box after the explanation |
| `observation` | `string` | What to look for in the preview |
| `hint` | `string` \| `string[]` | Shown in the hint box; an array renders as a bulleted list (e.g. a "Dica" ladder) |
| `html` | `string` | Preview panel markup |
| `api` | `string` \| `() => string` | Extra functions injected into preview |
| `solution` | `string` | Facilitator-only reference (hidden in student mode) |
| `checks` | `{ test, message }[]` | Actionable feedback when validation fails |
| `validationHint` | `string` | Fallback message if all checks pass but validate fails |
| `visualControls` | `object[]` | Side-panel controls that patch editor code |
| `terminal` | `boolean` | Show terminal (`escrever` / `lerInput`) |
| `interactive` | `boolean` | Disables infinite-loop timeout in preview |

## Validation feedback

When `validate` returns `false`, `ExerciseValidator.evaluate` runs `checks` (on the exercise or in `assets/app/exercise-checks.js`) and shows the first failing `message`.

## Maintainer script

```bash
node scripts/validate-exercises.js
```

Checks duplicate ids, required fields, curriculum coverage (no orphan “Outros” topic), and that every exercise has feedback checks.
