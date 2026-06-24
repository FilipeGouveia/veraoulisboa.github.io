# TODO

## Bug Triage

- Runtime has bugs.
- ~~Exercise 8: The non-completion message expects the value 10, but should accept 6 or more.~~ ✔️ Done (`numeros-com-if`).
- ~~Exercise 17: The code example has a validation error.~~ ✔️ Done — the `aleatorio` (dice) feedback check tested `s.rolls`, which the runtime never sets; now reads `s.die` / `s.dice`.
- ~~Exercise 22: In the hint, explain that a string is a list of characters and suggest using `.length` to validate the word length.~~ ✔️ Done — added a new `palavra-passe` exercise (strings as character lists + `.length` validation).
- Found during review: `cesar-desencriptar` explanation said "SPHY"; should be "SPbY". ✔️ Done.
- Found during testing: `donatello-circulo` reference solution (1px/1°×360) never passed its own validate (which required value 10); realigned instructions + validate to the 1px/1° approach. ✔️ Done.
- ~~Objetivos sitting next to "Mostrar Avançado"; should be below it and only visible when pressed.~~ ✔️ Done — all briefing sections (Objetivos, Observar, Dica, Avançado) are now consistent collapsible toggles, collapsed by default.

- Found during manual run (jsdom + Chrome): `strings` starter called `criarCartao(nome, detalhe)` with the variables commented out → ReferenceError on the first Executar; starter now declares them empty (like `ola`/`falar`). ✔️ Done.

## Feature Triage

- Create an interactive tutorial for the student. (large — still open)
- Add visual editing elements (e.g., letter color in the 1st chapter, font size in the 2nd, letter color in the 3rd, etc.). (still open)
- ~~Exercises 19, 20 and 21: Make execution faster.~~ ✔️ Done — lower frame floor + inter-move delay on the donatello loop exercises.
- ~~Exercise 13 onwards: There is no need to add `const podeAvancar: boolean = true;` as it is already predefined in the code.~~ ✔️ Done (`booleanos` instruction reworded).
- New: optional "Avançado" collapsible section per exercise for deeper detail. ✔️ Done (now on all 35 exercises).

## Task Status

| Task name [feature]/[bug] | To implement | Implementing | Ready | Responsible |
|---------------------------|--------------|--------------|-------|--------------|
| Exercise 4: improve lerInput hint [bug] | | | ✔️ | Diogo |
| Exercise 20: number 8 off-screen [bug] | | | ✔️ | Diogo |
| Exercise 23: correct SPbY text [bug] | | | ✔️ | Diogo |
| Cancel button [feature] | | | ✔️ | Diogo |
| End session modal with diploma and sharing [feature] | | | ✔️ | Diogo |
| Exercise 11: fruit strings and for...of hint [feature] | | | ✔️ | Diogo |
| Exercise 13: add ligarSemaforo() info [feature] | | | ✔️ | Diogo |
| Exercise 14 and 15: swap order [feature] | | | ✔️ | Diogo |
| Exercise 16: add !== hint [feature] | | | ✔️ | Diogo |
| Exercise 17: explain await earlier [feature] | | | ✔️ | Diogo |
| Exercise 18: indicate movement function names [feature] | | | ✔️ | Diogo |
| Exercise 8: feedback accepts 6 or more, not only 10 [bug] | | | ✔️ | Claude |
| cesar-desencriptar: correct SPbY ciphertext in explanation [bug] | | | ✔️ | Claude |
| Desafios (arquiteto, mvp-futebol): strip starter code, add tip ladder [feature] | | | ✔️ | Claude |
| aleatorio: dice feedback reads s.die/s.dice, not s.rolls [bug] | | | ✔️ | Claude |
| palavra-passe: new exercise on strings and .length [feature] | | | ✔️ | Claude |
| "Avançado" collapsible advanced-explanation section + content [feature] | | | ✔️ | Claude |
| Exercises 19-21: faster donatello loop execution [feature] | | | ✔️ | Claude |
| booleanos: don't tell students to create predefined podeAvancar [feature] | | | ✔️ | Claude |
| donatello-circulo: solution now satisfies its own validate [bug] | | | ✔️ | Claude |

## QA Findings (2026-06-23)

> Full report in `report.md`. Priority: 🔴 high · 🟡 medium · 🟢 low.

### Bug Triage

_All nine resolved 2026-06-23 (✔️ in Task Status (QA) below)._

- 🔴 `intro`: passes automatically (starter already has 8+ char message) — add interactivity check to `validate`
- 🔴 `strings`: explanation promises TS will catch type errors but transpiler strips types silently — update text or add type-checking
- 🔴 `semaforo-amarelo`: can pass without using the `estado` variable — add `/estado/.test(code)` to validate
- 🟡 `numeros-variavel`: hardcoding `84` bypasses the multiplication — verify `/12\s*\*\s*7/.test(code)` in validate
- 🟡 `cesar`: hardcoding `"SPbY"` skips the algorithm — add `/charCodeAt/.test(code)` to validate
- 🟡 `arvore-procura`: `treeSteps <= listSteps` is a false-negative for degenerate (sorted) lists — remove or relax this condition
- 🟡 `donatello-roomba`: valid code may rarely fail if random walk misses a wall in 1200 steps — increase step count or lower wall-reach threshold
- 🟢 `pi` (dardos): 5000 iterations can freeze slow machines — cap total or batch async
- 🟢 `grafo-caminho`: instructions don't mention that path order matters — add a note

### Task Status (QA)

| Task name [feature]/[bug] | To implement | Implementing | Ready | Responsible |
|---------------------------|--------------|--------------|-------|--------------| 
| intro: validate requires interactivity, not just starter message [bug] | | | ✔️ | Claude |
| strings: fix/remove promise that TS enforces types at runtime [bug] | | | ✔️ | Claude |
| semaforo-amarelo: validate must use estado variable [bug] | | | ✔️ | Claude |
| numeros-variavel: verify multiplication expression in validate [bug] | | | ✔️ | Claude |
| cesar: require charCodeAt in validate to prevent hardcoding [bug] | | | ✔️ | Claude |
| arvore-procura: relax treeSteps <= listSteps condition [bug] | | | ✔️ | Claude |
| donatello-roomba: increase steps or lower wall threshold [bug] | | | ✔️ | Claude |
| pi: cap darts or batch async to avoid UI freeze [feature] | | | ✔️ | Claude |
| grafo-caminho: note that path order matters in instructions [feature] | | | ✔️ | Claude |

## QA Round 2 — Verification + New Findings (2026-06-23, session 2)

> All 9 fixes from Round 1 verified ✅. Full details in `report.md`.

### Bug Triage

- ~~🔴 `main.js`: `initApp` defined **twice**; first definition is dead code, second silently wins.~~ ✔️ Done — removed the dead first definition; one `initApp` remains, referenced only by the DOMContentLoaded listener.

### Task Status (QA Round 2)

| Task name [feature]/[bug] | To implement | Implementing | Ready | Responsible |
|---------------------------|--------------|--------------|-------|-------------|
| main.js: remove duplicate initApp function [bug] | | | ✔️ | Claude |


## Reviewer Feedback (2026-06-24)

> Overarching goal: adapt the guide for students with very little programming experience — a slightly stronger tutorial component that helps them translate their reasoning into code.

### Presentation / structure

- Hide the timer while solving exercises; show it only on the leaderboard.
- Reorder the briefing sections to: Objetivo/Pergunta -> O que deves observar (resultados esperados) -> Dica -> Avancado.
- The Objetivo/Pergunta should always be visible by default (collapse only the rest), so students immediately see the challenge and its points. NOTE: partially reverses VUL-0016, which collapsed every section by default.

### Content / concepts

- Exercise 1: introduce the language's basic syntax (declaring variables, semicolons, etc.) — ideally via an animation (as previously discussed).
- Unify the names of the result-printing functions (pick one of mostrarMensagem / escrever / ...).
- Introduce or reinforce fundamentals across the exercises:
  - const vs let, and when to use each;
  - if and comparison operators (>, ===, !=, ...);
  - logical operators (|| for OR, && for AND);
  - array indexing (0-based) and how to declare arrays;
  - for loops: teach BOTH forms the exercises require (only one is explained today) and how to break out of a loop.
- donatello: add a curiosity about who Donatello was and why these methods carry his name.
- cesar (cifras): one of the hardest — charCodeAt is not explained enough in the briefing.
- formula (raizes da equacao): include the quadratic formula in the briefing.
- arvore-procura (lista vs arvore): very challenging for this audience (no prior exposure to these structures) — add an intermediate exercise with a simple tree example.

### Task Status (Reviewer Feedback)

| Task name [feature]/[bug] | To implement | Implementing | Ready | Responsible |
|---------------------------|--------------|--------------|-------|-------------|
| Hide timer during exercises, show only on leaderboard [feature] | ⬜ | | | |
| Reorder briefing: Objetivo -> Observar -> Dica -> Avancado [feature] | ⬜ | | | |
| Objetivo/Pergunta always visible by default (others collapsed) [feature] | ⬜ | | | |
| Exercise 1: basic-syntax intro via animation [feature] | ⬜ | | | |
| Unify result-printing function names (mostrarMensagem/escrever/...) [feature] | ⬜ | | | |
| Reinforce const/let, if+operators, &&/||, arrays+indexing across exercises [feature] | ⬜ | | | |
| for loops: teach both forms + how to break out [feature] | ⬜ | | | |
| donatello: add curiosity about who Donatello was [feature] | ⬜ | | | |
| cesar: explain charCodeAt better in the briefing [feature] | ⬜ | | | |
| formula: include the quadratic formula in the briefing [feature] | ⬜ | | | |
| arvore-procura: add an intermediate simple-tree exercise [feature] | ⬜ | | | |

