# TODO

## Bug Triage

- Runtime has bugs.
- ~~Exercise 8: The non-completion message expects the value 10, but should accept 6 or more.~~ ✔️ Done (`numeros-com-if`).
- ~~Exercise 17: The code example has a validation error.~~ ✔️ Done — the `aleatorio` (dice) feedback check tested `s.rolls`, which the runtime never sets; now reads `s.die` / `s.dice`.
- ~~Exercise 22: In the hint, explain that a string is a list of characters and suggest using `.length` to validate the word length.~~ ✔️ Done — added a new `palavra-passe` exercise (strings as character lists + `.length` validation).
- Found during review: `cesar-desencriptar` explanation said "SPHY"; should be "SPbY". ✔️ Done.

## Feature Triage

- Add explanatory animations instead of running text, for greater student engagement.
- Create an interactive tutorial for the student.
- Add visual editing elements (e.g., letter color in the 1st chapter, font size in the 2nd, letter color in the 3rd, etc.).
- Exercises 19, 20 and 21: Make execution faster.
- Exercise 13 onwards: There is no need to add `const podeAvancar: boolean = true;` as it is already predefined in the code.

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
