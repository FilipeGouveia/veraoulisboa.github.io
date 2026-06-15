window.PreviewBuilder = (() => {
  const baseCss = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; font-family: Inter, Arial, sans-serif; background: #eef2f7; color: #1f2937; }
    .stage { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    .panel { width: min(650px, 100%); min-height: 390px; padding: 28px; border-radius: 8px; background: white; box-shadow: 0 18px 45px rgba(20, 35, 54, 0.16); }
    .panel.dark { background: #102033; color: white; }
    h1, h2, p { overflow-wrap: anywhere; }
    h1 { margin: 0 0 12px; font-size: clamp(30px, 8vw, 48px); line-height: 1.05; }
    h2 { margin: 0 0 12px; }
    p { line-height: 1.5; }
    .big-value { margin: 18px 0; font-size: clamp(38px, 12vw, 78px); font-weight: 800; line-height: 1; }
    .pill-row, .grid-list { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 18px 0 0; list-style: none; }
    .pill-row li, .grid-list li { padding: 10px 12px; border-radius: 8px; background: #e8eef7; font-weight: 700; }
    .pill-row li { cursor: grab; user-select: none; }
    .traffic { width: 116px; padding: 14px; display: grid; gap: 12px; border-radius: 18px; background: #1f2937; }
    .light { width: 88px; aspect-ratio: 1; border-radius: 999px; background: #566172; opacity: 0.35; }
    .light.on { opacity: 1; box-shadow: 0 0 22px currentColor; }
    .red { color: #ef4444; background: #ef4444; }
    .yellow { color: #f59e0b; background: #f59e0b; }
    .green { color: #22c55e; background: #22c55e; }
    canvas { width: 100%; height: 360px; border-radius: 8px; background: #f8fafc; border: 1px solid #d9e2ef; }
    .room { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 20px; }
    .cell { aspect-ratio: 1; display: grid; place-items: center; border-radius: 8px; background: #e8eef7; font-size: 26px; font-weight: 800; }
    .cell.wall { background: #475569; color: white; }
    .cell.goal { background: #bbf7d0; }
    .cell.robot { background: #bfdbfe; }
    .meter { height: 18px; overflow: hidden; border-radius: 999px; background: #d8e1ef; }
    .meter span { display: block; height: 100%; width: 0%; background: #0077b6; transition: width 180ms ease; }
    .graph-area, .tree-area { position: relative; width: 100%; min-height: 360px; border: 1px solid #d9e2ef; border-radius: 8px; background: #f8fafc; overflow: hidden; }
    .tree-area { min-height: 300px; }
    .node { position: absolute; width: 54px; height: 54px; display: grid; place-items: center; border-radius: 999px; background: #2f5d78; color: white; font-weight: 800; transform: translate(-50%, -50%); z-index: 2; }
    .node { cursor: grab; user-select: none; touch-action: none; }
    .node.active { background: #d97706; }
    .edge { position: absolute; height: 4px; background: #94a3b8; transform-origin: left center; z-index: 1; }
    .structured-list { display: flex; gap: 8px; flex-wrap: wrap; padding: 0; margin: 12px 0 18px; list-style: none; }
    .structured-list li { min-width: 42px; padding: 8px 10px; border-radius: 8px; background: #e8eef7; text-align: center; font-weight: 800; }
    .structured-list li.active { background: #d97706; color: white; }
  `;

  const baseApi = `
    window.exerciseState = {};
    window.exerciseFinished = false;
    window.onerror = function(message, source, lineno, colno, error) {
      let msg = message;
      const offset = window.exerciseState.lineOffset;
      if (lineno && offset) {
        const relativeLine = lineno - offset + 1;
        if (relativeLine > 0 && relativeLine < 1000) {
          msg += " (linha " + relativeLine + ")";
        }
      }
      parent.postMessage({ type: 'student-code-error', message: msg, state: window.exerciseState }, '*');
      return true;
    };
    window.onunhandledrejection = function(event) {
      parent.postMessage({ type: 'student-code-error', message: event.reason?.message || event.reason || 'Unhandled promise rejection', state: window.exerciseState }, '*');
    };
    function setText(id, value) {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value);
    }
    function reportOk() {
      window.exerciseFinished = true;
      const send = () => parent.postMessage({ type: 'student-code-ok', state: window.exerciseState }, '*');
      if (typeof window.playAnimation === 'function') {
        window.playAnimation().then(send);
        return;
      }
      send();
    }
    function reportError(error, offset) {
      window.exerciseFinished = true;
      let message = error.message || String(error);
      let lineNum = null;
      if (error && error.stack) {
        const lines = error.stack.split('\\n');
        for (const line of lines) {
          const match = line.match(/:(\\d+):(\\d+)/);
          if (match) {
            lineNum = Number(match[1]);
            break;
          }
        }
      }
      if (lineNum && offset) {
        const relativeLine = lineNum - offset + 1;
        if (relativeLine > 0 && relativeLine < 1000) {
          message += " (linha " + relativeLine + ")";
        }
      }
      parent.postMessage({ type: 'student-code-error', message: message, state: window.exerciseState }, '*');
    }
    function escrever() {
      var parts = [];
      for (var i = 0; i < arguments.length; i++) parts.push(String(arguments[i]));
      var text = parts.join(' ');
      parent.postMessage({ type: 'console-write', text: text }, '*');
    }
    function lerInput(mensagem) {
      if (mensagem) escrever(mensagem);
      parent.postMessage({ type: 'request-input' }, '*');
      return new Promise(function(resolve) {
        function handler(event) {
          if (event.data && event.data.type === 'provide-input') {
            window.removeEventListener('message', handler);
            resolve(event.data.value);
          }
        }
        window.addEventListener('message', handler);
      });
    }
  `;

  function getExerciseApi(exercise) {
    return typeof exercise.api === 'function' ? exercise.api() : exercise.api;
  }

  function buildDocument(exercise, studentCode, forCodePen = false) {
    const runnableCode = forCodePen ? studentCode : AppUtils.stripTypeScript(studentCode);
    const isInteractive = exercise.interactive === true || /lerInput\s*\(/.test(studentCode);
    const timeoutGuard = (forCodePen || isInteractive) ? '' : `
      setTimeout(() => {
        if (!window.exerciseFinished) {
          parent.postMessage({ type: 'student-code-error', message: 'O programa demorou demasiado. Verifica se tens um ciclo infinito.', state: window.exerciseState }, '*');
        }
      }, 3000);
    `;

    const placeholder = 'window.exerciseState.lineOffset = 0;';
    const tempPrefixHtml = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
  <style>${baseCss}</style>
</head>
<body>
  ${exercise.html}
  <script>${baseApi}<\/script>
  <script>${getExerciseApi(exercise)}<\/script>
  <script>${placeholder}<\/script>
  <script>
    (async () => {
      try {
        ${timeoutGuard}
`;

    const lineOffset = tempPrefixHtml.split('\n').length;
    const prefixHtml = tempPrefixHtml.replace(placeholder, `window.exerciseState.lineOffset = ${lineOffset};`);

    return `${prefixHtml}${runnableCode}
        reportOk();
      } catch (error) {
        reportError(error, ${lineOffset});
      }
    })();
  <\/script>
</body>
</html>`;
  }

  return {
    baseApi,
    baseCss,
    buildDocument,
    getExerciseApi,
  };
})();

