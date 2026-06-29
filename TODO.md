# TODO

> Living task list. Completed work is summarised at the bottom; full detail is in the git history and `report.md`.

## Open

- **Interactive tutorial** for the student (large).
- **Visual editing controls** — extend the `visualControls` sliders (colour, size, …) to more exercises / chapters.
- **Fill the gaps** — add `animation` / `Curiosidade` / `Avançado` to the exercises that still lack them.

---

## Done

### Exercises & curriculum
- **41 exercises** across 8 chapters. New: `const-let`, `arrays-indices`, `ciclos-for`, `operadores-logicos` (Operações Booleanas), `comparacoes`, `palavra-passe`, `arvore-intro`.
- Decisões/Ciclos reordered: boolean operators first; Galeria de frutas #20; "for e break" #21.
- Per-concept **animations** on most exercises; **Avançado** on all; **Curiosidade!** on Donatello.

### Teaching & content (reviewer feedback)
- First exercise teaches function / argument / parameter, with a token-by-token line animation.
- Unified panel output to `mostrar()`; `escrever()` for terminal (≈ `print` in other languages).
- Reinforced const vs let, comparison operators (incl. `==` vs `===`), `&&` / `||` / `!`, arrays + 0-based indexing, both `for` forms + `break`.
- Clearer `charCodeAt` (cesar) and the quadratic formula; Donatello curiosity.

### Presentation
- Briefing is consistent collapsible toggles — **O que deves fazer** (open by default) → O que deves observar → Dica → Avançado → Curiosidade!.
- Timer hidden during exercises (shown only on the leaderboard).

### Bugs & QA — all resolved
- Original triage: exercise 8 / 17 / 22, SPbY typo, donatello-circulo validate, podeAvancar wording, faster donatello loops, desafios starter-stripping.
- **QA Round 1** (2026-06-23): 9 validation-gap findings — `intro`, `strings`, `semaforo-amarelo`, `numeros-variavel`, `cesar`, `arvore-procura`, `donatello-roomba`, `pi`, `grafo-caminho` (details in `report.md`).
- **QA Round 2**: removed the duplicate `initApp`.
- Found while working: `strings` starter ReferenceError; misplaced Donatello Avançado.

### Earlier work (Diogo)
- Exercise 4 lerInput hint; exercise 20 off-screen "8"; exercise 23 SPbY text; cancel button; end-session diploma/sharing modal; exercise 11 / 13 / 16 / 17 / 18 hints; exercise 14/15 swap.
