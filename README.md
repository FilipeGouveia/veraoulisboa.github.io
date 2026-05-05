## Verão ULisboa - JavaScript/TypeScript classroom lab

This project is now focused on a minimal programming environment for high school students:

- students only edit the `main.ts` style code shown in the textarea;
- the HTML and CSS are hidden inside the platform;
- clicking **Executar** runs the student code and updates the graphical interface;
- clicking **Abrir no CodePen** opens the same exercise on CodePen with the JavaScript/TypeScript editor selected.

The local runner accepts beginner-friendly TypeScript annotations such as:

```ts
const nome: string = "Ana";
const pontos: number = 80;
```

For CodePen, the project uses CodePen's prefill endpoint and sends the fixed HTML/CSS together with the student code using `js_pre_processor: "typescript"`.

The exercise set is written in TypeScript. The original FCUL tutorial is used only as inspiration for the programming topics: strings, numbers, loops, booleans, turtle-style drawing, robot movement, Caesar cipher, quadratic formula, pi estimation, and while loops.

## Structure

- `assets/main.js` contains the platform runner: navigation, cache, scoring, preview iframe and CodePen export.
- `assets/exercises/*.js` contains the exercise content, split by topic.
- Each exercise can define `starter`, `solution`, `explanation`, `instructions`, a visual `html` panel, helper `api` functions, and a `validate` function.

The current version intentionally includes a **Mostrar resposta** button and `solution` fields so facilitators can test every exercise quickly. Remove that button and the `solution` fields before publishing the student version.
