const STORAGE_KEY = 'veraoProgramacaoLab:v4';
const ENABLE_SOLUTIONS = true;
const topics = window.exerciseTopics || [];
const exercises = topics.flatMap((topic) => topic.exercises.map((exercise) => ({ ...exercise, topic: topic.title })));

const baseCss = `
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
`;

const baseApi = `
  window.exerciseState = {};
  window.exerciseFinished = false;
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
  function reportError(error) {
    window.exerciseFinished = true;
    parent.postMessage({ type: 'student-code-error', message: error.message, state: window.exerciseState }, '*');
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


let appState = loadState();
let activeTopicId = appState.activeTopicId || topics[0]?.id;
let activeExerciseId = appState.activeExerciseId || exercises[0]?.id;
let lastRunState = {};
let currentRunCanScore = false;

function setFeedback(message, status = 'neutral') {
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.className = `feedback ${status}`;
}

function loadState() {
  const fallback = {
    activeTopicId: topics[0]?.id,
    activeExerciseId: exercises[0]?.id,
    score: 0,
    completed: {},
    codes: {},
    timeSpent: 0,
  };

  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getActiveExercise() {
  return exercises.find((exercise) => exercise.id === activeExerciseId) || exercises[0];
}

function getEditor() {
  return document.getElementById('editor');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripTypeScript(code) {
  return code
    .replace(/:\s*\w+\[\]/g, '')
    .replace(/:\s*(string|number|boolean|unknown|any|void)\b/g, '')
    .replace(/\)\s*:\s*(void|string|number|boolean|unknown|any)\s*{/g, ') {')
    .replace(/\binterface\s+\w+\s*{[\s\S]*?}\s*/g, '')
    .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '');
}

function getExerciseApi(exercise) {
  return typeof exercise.api === 'function' ? exercise.api() : exercise.api;
}

function buildPreviewDocument(exercise, studentCode, forCodePen = false) {
  const runnableCode = forCodePen ? studentCode : stripTypeScript(studentCode);
  const isInteractive = exercise.interactive === true;
  const timeoutGuard = (forCodePen || isInteractive) ? '' : `
    setTimeout(() => {
      if (!window.exerciseFinished) {
        parent.postMessage({ type: 'student-code-error', message: 'O programa demorou demasiado. Verifica se tens um ciclo infinito.', state: window.exerciseState }, '*');
      }
    }, 3000);
  `;

  return `<!DOCTYPE html>
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
  <script>
    (async () => {
      try {
        ${timeoutGuard}
        ${runnableCode}
        reportOk();
      } catch (error) {
        reportError(error);
      }
    })();
  <\/script>
</body>
</html>`;
}

function renderExerciseList() {
  const list = document.getElementById('exerciseList');
  let counter = 0;

  list.innerHTML = topics.map((topic) => {
    const expanded = topic.id === activeTopicId;
    const completedInTopic = topic.exercises.filter((exercise) => appState.completed[exercise.id]).length;
    const topicButtons = topic.exercises.map((exercise) => {
      counter += 1;
      const completed = Boolean(appState.completed[exercise.id]);
      const active = exercise.id === activeExerciseId;
      return `
        <button
          type="button"
          class="exercise-item ${active ? 'active' : ''} ${completed ? 'done' : ''}"
          onclick="selectExercise('${topic.id}', '${exercise.id}')"
        >
          <span>${String(counter).padStart(2, '0')}</span>
          <strong>${escapeHtml(exercise.title)}</strong>
          <small>${completed ? 'concluído' : exercise.points + ' pts'}</small>
        </button>
      `;
    }).join('');

    return `
      <section class="topic-group ${expanded ? 'open' : ''}">
        <button type="button" class="topic-toggle" onclick="selectTopic('${topic.id}')">
          <span>
            <strong>${escapeHtml(topic.title)}</strong>
            <small>${completedInTopic}/${topic.exercises.length} concluídos</small>
          </span>
          <span>${expanded ? '−' : '+'}</span>
        </button>
        <div class="topic-exercises">${expanded ? topicButtons : ''}</div>
      </section>
    `;
  }).join('');
}

function renderActiveExercise() {
  const exercise = getActiveExercise();
  const completed = Boolean(appState.completed[exercise.id]);
  const editor = getEditor();

  document.getElementById('exerciseTopic').textContent = exercise.topic;
  document.getElementById('exerciseTitle').textContent = exercise.title;
  document.getElementById('exerciseStatus').textContent = completed ? 'Concluído' : `${exercise.points} pontos`;
  document.getElementById('exerciseStatus').className = `status-badge ${completed ? 'done' : ''}`;
  document.getElementById('exerciseBody').innerHTML = `
    ${(exercise.explanation || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
    <p><strong>Objetivo:</strong></p>
    <ul>${exercise.instructions.map((instruction) => `<li>${escapeHtml(instruction)}</li>`).join('')}</ul>
    <p><strong>O que deves observar:</strong> ${escapeHtml(exercise.observation || 'Executa o programa e compara o resultado visual com o objetivo.')}</p>
    <button type="button" class="hint-toggle" onclick="toggleHint()">Mostrar dica</button>
  `;
  document.getElementById('hintBox').textContent = exercise.hint;
  document.getElementById('hintBox').hidden = true;

  editor.value = appState.codes[exercise.id] || exercise.starter;
  lastRunState = {};
  runStudentCode(false);
  renderExerciseList();
  updateHeader();
}

function selectTopic(topicId) {
  saveCurrentCode();
  activeTopicId = topicId;
  appState.activeTopicId = topicId;
  const topic = topics.find((item) => item.id === topicId);
  if (topic && !topic.exercises.some((exercise) => exercise.id === activeExerciseId)) {
    activeExerciseId = topic.exercises[0].id;
    appState.activeExerciseId = activeExerciseId;
  }
  saveState();
  renderActiveExercise();
}

function selectExercise(topicId, exerciseId) {
  saveCurrentCode();
  activeTopicId = topicId;
  activeExerciseId = exerciseId;
  appState.activeTopicId = topicId;
  appState.activeExerciseId = exerciseId;
  saveState();
  renderActiveExercise();
}

function saveCurrentCode() {
  const exercise = getActiveExercise();
  if (!exercise) return;
  appState.codes[exercise.id] = getEditor().value;
  saveState();
}

function clearConsole() {
  const consoleEl = document.getElementById('console');
  const output = document.getElementById('consoleOutput');
  const form = document.getElementById('consoleForm');
  const status = document.getElementById('consoleStatus');
  output.innerHTML = '';
  form.hidden = true;
  status.textContent = '';
  consoleEl.hidden = true;
}

function showConsole() {
  document.getElementById('console').hidden = false;
}

function appendConsoleOutput(text, type = 'output') {
  showConsole();
  const output = document.getElementById('consoleOutput');
  const line = document.createElement('div');
  line.className = 'console-line ' + type;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function showConsoleInput() {
  showConsole();
  const form = document.getElementById('consoleForm');
  const input = document.getElementById('consoleInput');
  const status = document.getElementById('consoleStatus');
  form.hidden = false;
  status.textContent = 'À espera de input…';
  input.value = '';
  input.focus();
}

function submitConsoleInput() {
  const input = document.getElementById('consoleInput');
  const form = document.getElementById('consoleForm');
  const status = document.getElementById('consoleStatus');
  const value = input.value;

  appendConsoleOutput('▸ ' + value, 'input-echo');
  form.hidden = true;
  status.textContent = '';
  input.value = '';

  const preview = document.getElementById('preview');
  preview.contentWindow.postMessage({ type: 'provide-input', value: value }, '*');
}

function runStudentCode(showConsole = true) {
  const exercise = getActiveExercise();
  const code = getEditor().value;
  const preview = document.getElementById('preview');

  clearConsole();
  appState.codes[exercise.id] = code;
  saveState();
  currentRunCanScore = showConsole;
  preview.srcdoc = buildPreviewDocument(exercise, code);
  if (showConsole) setFeedback('A executar...', 'neutral');
}

function completeExercise(exercise) {
  if (appState.completed[exercise.id]) return;

  appState.completed[exercise.id] = true;
  appState.score += exercise.points;
  saveState();
  updateHeader();
  renderExerciseList();
  document.getElementById('exerciseStatus').textContent = 'Concluído';
  document.getElementById('exerciseStatus').className = 'status-badge done';
}

function updateHeader() {
  const completedCount = Object.keys(appState.completed).length;
  document.getElementById('score').textContent = appState.score;
  document.getElementById('completedCount').textContent = completedCount;
  document.getElementById('totalCount').textContent = exercises.length;

  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function showSolution() {
  if (!ENABLE_SOLUTIONS) return;
  const exercise = getActiveExercise();
  if (!exercise?.solution) return;
  getEditor().value = exercise.solution;
  saveCurrentCode();
  setFeedback('Resposta colocada no editor para teste.', 'neutral');
}

function toggleHint() {
  const hintBox = document.getElementById('hintBox');
  const isHidden = hintBox.hidden;
  hintBox.hidden = !isHidden;
  const button = document.querySelector('.hint-toggle');
  if (button) button.textContent = isHidden ? 'Esconder dica' : 'Mostrar dica';
}

function openInCodePen() {
  const exercise = getActiveExercise();
  const code = getEditor().value;
  const data = {
    title: `Verão ULisboa - ${exercise.title}`,
    description: `Exercício de TypeScript: ${exercise.title}. O HTML e CSS estão preparados para os estudantes trabalharem apenas no TypeScript.`,
    html: exercise.html,
    css: baseCss,
    js: `${baseApi}\n${getExerciseApi(exercise)}\n\n${code}`,
    js_pre_processor: 'typescript',
    layout: 'left',
    editors: '001',
  };

  const form = document.createElement('form');
  form.action = 'https://codepen.io/pen/define';
  form.method = 'POST';
  form.target = '_blank';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(data);

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function restartTutorial() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

window.addEventListener('message', (event) => {
  const msgType = event.data?.type;
  if (!msgType) return;

  // Handle console messages
  if (msgType === 'console-write') {
    appendConsoleOutput(event.data.text);
    return;
  }
  if (msgType === 'request-input') {
    showConsoleInput();
    return;
  }

  if (!msgType.startsWith('student-code-')) return;

  const exercise = getActiveExercise();
  lastRunState = event.data.state || {};

  if (!currentRunCanScore) {
    setFeedback('Pronto para executar.', 'neutral');
    return;
  }

  if (event.data.type === 'student-code-error') {
    setFeedback(`Erro: ${event.data.message}`, 'wrong');
    return;
  }

  const isCorrect = exercise.validate(getEditor().value, lastRunState);
  if (isCorrect) {
    completeExercise(exercise);
    setFeedback(`Correto! Ganhaste ${exercise.points} pontos.`, 'correct');
  } else {
    setFeedback('O código correu, mas ainda não cumpre o objetivo.', 'wrong');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('solutionBtn').hidden = !ENABLE_SOLUTIONS;
  getEditor().addEventListener('input', saveCurrentCode);
  getEditor().addEventListener('keydown', function handleEditorIndent(event) {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const previousLine = before.split('\n').slice(-1)[0];
    const indent = previousLine.match(/^\s*/)[0];
    const newValue = `${before}\n${indent}${after}`;
    this.value = newValue;
    this.selectionStart = this.selectionEnd = start + 1 + indent.length;
    saveCurrentCode();
  });

  // Wire up interactive console form
  document.getElementById('consoleForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitConsoleInput();
  });

  renderActiveExercise();
  setInterval(() => {
    appState.timeSpent += 1;
    saveState();
    updateHeader();
  }, 1000);
});
