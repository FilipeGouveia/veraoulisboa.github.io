const STORAGE_KEY = 'veraoProgramacaoLab:v5';
const ENABLE_SOLUTIONS = LabMode.isFacilitator;

const { topics, exercises } = Curriculum.build();

let appState = loadState();
let activeExerciseId = getValidExerciseId(appState.activeExerciseId);
let activeTopicId = getTopicIdForExercise(activeExerciseId);
let lastRunState = {};
let currentRunCanScore = false;
let currentRunIsActive = false;
let editorFocused = false;
let tabVisible = document.visibilityState === 'visible';
let timerPaused = Boolean(appState.timerPaused);

appState.activeTopicId = activeTopicId;
appState.activeExerciseId = activeExerciseId;
saveState();

function loadState() {
  const fallback = {
    activeTopicId: topics[0]?.id,
    activeExerciseId: exercises[0]?.id,
    score: 0,
    completed: {},
    codes: {},
    timeSpent: 0,
    timerPaused: false,
  };

  try {
    const loaded = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (loaded && !loaded.failed) loaded.failed = {};
    return { ...fallback, ...loaded };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getValidExerciseId(exerciseId) {
  return exercises.some((exercise) => exercise.id === exerciseId)
    ? exerciseId
    : exercises[0]?.id;
}

function getTopicIdForExercise(exerciseId) {
  return topics.find((topic) => (
    topic.exercises.some((exercise) => exercise.id === exerciseId)
  ))?.id || topics[0]?.id;
}

function getActiveExercise() {
  return exercises.find((exercise) => exercise.id === activeExerciseId) || exercises[0];
}

function getEditor() {
  return document.getElementById('editor');
}

function getEditorHighlight() {
  return document.getElementById('editorHighlight');
}

function terminalEnabledForActiveExercise() {
  return getActiveExercise().terminal === true;
}

function syncTerminalVisibility() {
  TerminalPanel.setEnabled(terminalEnabledForActiveExercise());
}


function setFeedback(message, status = 'neutral') {
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.className = `feedback ${status}`;
}

function highlightTypeScript(code) {
  const tokenPattern = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|default|do|else|false|finally|for|function|if|in|Infinity|let|new|null|return|switch|true|try|var|while)\b|\b(?:any|boolean|number|string|unknown|void)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*(?=\s*\()|[+\-*/%=<>!&|?:]+)/g;
  let html = '';
  let cursor = 0;
  let match;

  while ((match = tokenPattern.exec(code)) !== null) {
    const token = match[0];
    html += AppUtils.escapeHtml(code.slice(cursor, match.index));

    let className = 'syntax-operator';
    if (/^\/\//.test(token) || /^\/\*/.test(token)) className = 'syntax-comment';
    else if (/^["'`]/.test(token)) className = 'syntax-string';
    else if (/^\d/.test(token)) className = 'syntax-number';
    else if (/^(any|boolean|number|string|unknown|void)$/.test(token)) className = 'syntax-type';
    else if (/^[A-Za-z_$]/.test(token) && !/^(async|await|break|case|catch|class|const|continue|default|do|else|false|finally|for|function|if|in|Infinity|let|new|null|return|switch|true|try|var|while)$/.test(token)) className = 'syntax-function';
    else if (/^[A-Za-z_$]/.test(token)) className = 'syntax-keyword';

    html += `<span class="${className}">${AppUtils.escapeHtml(token)}</span>`;
    cursor = match.index + token.length;
  }

  html += AppUtils.escapeHtml(code.slice(cursor));
  return html.endsWith('\n') ? `${html} ` : html;
}

function updateEditorHighlight() {
  const editor = getEditor();
  const highlight = getEditorHighlight();
  if (!editor || !highlight) return;

  highlight.innerHTML = highlightTypeScript(editor.value);
  highlight.scrollTop = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
}

function syncEditorHighlightScroll() {
  const editor = getEditor();
  const highlight = getEditorHighlight();
  if (!editor || !highlight) return;

  highlight.scrollTop = editor.scrollTop;
  highlight.scrollLeft = editor.scrollLeft;
}

function handleEditorInput() {
  saveCurrentCode();
  updateEditorHighlight();
}

function renderExerciseList() {
  const list = document.getElementById('exerciseList');
  let counter = 0;

  list.innerHTML = topics.map((topic) => {
    const expanded = topic.id === activeTopicId;
    const completedInTopic = topic.exercises.filter((exercise) => appState.completed[exercise.id]).length;
    const topicButtons = topic.exercises.map((exercise) => {
      counter += 1;
      return expanded ? renderExerciseButton(topic.id, exercise, counter) : '';
    }).join('');

    const isTopicCompleted = completedInTopic === topic.exercises.length;
    const completedClass = isTopicCompleted ? 'topic-completed' : '';
    const checkmark = isTopicCompleted ? ' <span class="completed-check">✓</span>' : '';

    return `
      <section class="topic-group ${expanded ? 'open' : ''}">
        <button type="button" class="topic-toggle" onclick="selectTopic('${topic.id}')">
          <span>
            <strong>${AppUtils.escapeHtml(topic.title)}${checkmark}</strong>
            <small class="${completedClass}">${completedInTopic}/${topic.exercises.length} concluídos</small>
          </span>
          <span>${expanded ? '−' : '+'}</span>
        </button>
        <div class="topic-exercises">${topicButtons}</div>
      </section>
    `;
  }).join('');

  function renderExerciseButton(topicId, exercise, number) {
    const completed = Boolean(appState.completed[exercise.id]);
    const failed = Boolean(appState.failed && appState.failed[exercise.id]);
    const active = exercise.id === activeExerciseId;

    let metaContent = '';
    let statusClass = '';
    if (completed) {
      statusClass = 'done';
      metaContent = '✓';
    } else if (failed) {
      statusClass = 'failed';
      metaContent = '✗';
    }

    return `
      <button
        type="button"
        class="exercise-item ${active ? 'active' : ''} ${statusClass}"
        onclick="selectExercise('${topicId}', '${exercise.id}')"
      >
        <span>${String(number).padStart(2, '0')}</span>
        <strong>${AppUtils.escapeHtml(exercise.title)}</strong>
        <small>${metaContent}</small>
      </button>
    `;
  }
}

function renderActiveExercise() {
  const exercise = getActiveExercise();
  const completed = Boolean(appState.completed[exercise.id]);
  const editor = getEditor();

  renderBriefing(exercise, completed);

  editor.value = VisualTools.annotateCode(exercise, appState.codes[exercise.id] || exercise.starter);
  updateEditorHighlight();
  appState.codes[exercise.id] = editor.value;
  saveState();

  lastRunState = {};
  syncTerminalVisibility();
  VisualTools.render(exercise, editor);
  runStudentCode(false);
  renderExerciseList();
  updateHeader();
}

function renderBriefing(exercise, completed) {
  document.getElementById('exerciseTopic').textContent = exercise.topic;
  document.getElementById('exerciseTitle').textContent = exercise.title;
  document.getElementById('exerciseStatus').textContent = completed ? 'Concluído' : `${exercise.points} pontos`;
  document.getElementById('exerciseStatus').className = `status-badge ${completed ? 'done' : ''}`;
  const section = (label, inner, open, buttonStyle = '') =>
    `<button type="button" class="section-toggle${open ? ' open' : ''}"${buttonStyle ? ` style="${buttonStyle}"` : ''} onclick="toggleSection(this)"><span class="chev">${open ? '▾' : '▸'}</span> ${label}</button>`
    + `<div class="section-box"${open ? '' : ' hidden'}>${inner}</div>`;
  const paragraphs = (value) => (value && value.length)
    ? value.map((paragraph) => `<p>${AppUtils.formatText(paragraph)}</p>`).join('')
    : '';
  const instructionsInner = `<ul>${exercise.instructions.map((instruction) => `<li>${AppUtils.formatText(instruction)}</li>`).join('')}</ul>`;
  const observationInner = `<p>${AppUtils.formatText(exercise.observation || 'Executa o programa e compara o resultado visual com o objetivo.')}</p>`;
  const hint = exercise.hint;
  const hintInner = Array.isArray(hint)
    ? `<ul>${hint.map((item) => `<li>${AppUtils.formatText(item)}</li>`).join('')}</ul>`
    : AppUtils.formatText(hint || '');
  const advancedInner = paragraphs(exercise.advanced);
  const curiosityInner = paragraphs(exercise.curiosity);
  document.getElementById('exerciseBody').innerHTML = `
    ${(exercise.explanation || []).map((paragraph) => `<p>${AppUtils.formatText(paragraph)}</p>`).join('')}
    ${section('Objetivos', instructionsInner, true)}
    ${section('O que deves observar', observationInner, false)}
    ${hintInner ? section('Dica', hintInner, false) : ''}
    ${advancedInner ? section('Avançado', advancedInner, false) : ''}
    ${curiosityInner ? section('Curiosidade!', curiosityInner, false, 'background:#2e7d32;color:#fff;border-color:#2e7d32;') : ''}
  `;

  const animationPanel = document.getElementById('animationPanel');
  document.getElementById('animationBody').innerHTML = exercise.animation || '';
  if (animationPanel) animationPanel.hidden = !exercise.animation;
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

function applyVisualControl(index, value) {
  const changed = VisualTools.apply(getActiveExercise(), getEditor(), index, value);
  if (!changed) return;
  updateEditorHighlight();
  saveCurrentCode();
  runStudentCode(false);
}

function runStudentCode(showConsole = true) {
  const exercise = getActiveExercise();
  const code = getEditor().value;

  syncTerminalVisibility();
  TerminalPanel.clear();
  appState.codes[exercise.id] = code;
  saveState();

  currentRunCanScore = showConsole;
  currentRunIsActive = showConsole;
  syncRunControls();

  document.getElementById('preview').srcdoc = PreviewBuilder.buildDocument(exercise, code);
  if (showConsole) setFeedback('A executar...', 'neutral');
}

function cancelStudentCode() {
  currentRunIsActive = false;
  currentRunCanScore = false;
  syncRunControls();
  TerminalPanel.clear();
  document.getElementById('preview').srcdoc = '<!DOCTYPE html><html><head></head><body></body></html>';
  setFeedback('Execução cancelada.', 'neutral');
}

function syncRunControls() {
  const cancelButton = document.getElementById('cancelExerciseBtn');
  const runButton = document.getElementById('runExerciseBtn');
  if (cancelButton) cancelButton.disabled = !currentRunIsActive;
  if (runButton) runButton.disabled = currentRunIsActive;
}

function completeExercise(exercise) {
  if (appState.completed[exercise.id]) return;

  appState.completed[exercise.id] = true;
  if (appState.failed) delete appState.failed[exercise.id];
  appState.score += exercise.points;
  saveState();
  updateHeader();
  renderExerciseList();
  document.getElementById('exerciseStatus').textContent = 'Concluído';
  document.getElementById('exerciseStatus').className = 'status-badge done';

  // Trigger Confetti explosion for premium completion feeling!
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  }
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

  getEditor().value = VisualTools.annotateCode(exercise, exercise.solution);
  updateEditorHighlight();
  saveCurrentCode();
  setFeedback('Resposta colocada no editor para teste.', 'neutral');
}

function toggleSection(button) {
  const box = button.nextElementSibling;
  if (!box) return;
  const willShow = box.hidden;
  box.hidden = !willShow;
  button.classList.toggle('open', willShow);
  const chevron = button.querySelector('.chev');
  if (chevron) chevron.textContent = willShow ? '▾' : '▸';
}

function toggleBriefing() {
  const briefing = document.getElementById('briefingArticle');
  const btn = document.getElementById('briefingToggleBtn');
  
  if (briefing.classList.contains('minimized')) {
    briefing.classList.remove('minimized');
    btn.textContent = '−';
    btn.title = 'Minimizar';
  } else {
    briefing.classList.add('minimized');
    btn.textContent = '+';
    btn.title = 'Maximizar';
  }
}

function openInCodePen() {
  const exercise = getActiveExercise();
  const code = getEditor().value;
  const data = {
    title: `Verão ULisboa - ${exercise.title}`,
    description: `Exercício de TypeScript: ${exercise.title}. O HTML e CSS estão preparados para os estudantes trabalharem apenas no TypeScript.`,
    html: exercise.html,
    css: PreviewBuilder.baseCss,
    js: `${PreviewBuilder.baseApi}\n${PreviewBuilder.getExerciseApi(exercise)}\n\n${code}`,
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

let isRestarting = false;

function restartTutorial() {
  if (!window.confirm('Recomeçar tudo? Perdes o progresso e a pontuação guardados neste browser.')) {
    return;
  }
  isRestarting = true;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function resetCurrentExercise() {
  const exercise = getActiveExercise();
  if (!window.confirm(`Repor o exercício "${exercise.title}"? O código volta ao início e a conclusão deste exercício é anulada.`)) {
    return;
  }

  delete appState.codes[exercise.id];
  if (appState.completed[exercise.id]) {
    appState.score = Math.max(0, appState.score - exercise.points);
    delete appState.completed[exercise.id];
  }
  if (appState.failed) delete appState.failed[exercise.id];
  saveState();
  renderActiveExercise();
  setFeedback('Exercício reposto. Podes começar de novo.', 'neutral');
}

function shouldCountTimer() {
  return tabVisible && editorFocused && !timerPaused;
}

function toggleTimerPause() {
  timerPaused = !timerPaused;
  appState.timerPaused = timerPaused;
  saveState();
  syncTimerPauseButton();
}

function syncTimerPauseButton() {
  const btn = document.getElementById('timerPauseBtn');
  if (!btn) return;
  btn.textContent = timerPaused ? '▶' : '⏸';
  btn.title = timerPaused ? 'Retomar cronómetro' : 'Pausar cronómetro';
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', String(timerPaused));
}

// ─── Leaderboard (Firebase) ────────────────────────────────────────────────
async function hashEmail(emailStr) {
  const msgBuffer = new TextEncoder().encode(emailStr.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function openLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  document.getElementById('modalScore').textContent = appState.score;
  document.getElementById('modalCompleted').textContent =
    Object.keys(appState.completed).length + '/' + exercises.length;
  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  document.getElementById('modalTime').textContent = minutes + ':' + seconds;
  document.getElementById('lbName').value = '';
  document.getElementById('lbEmail').value = '';
  const groupInput = document.getElementById('lbGroup');
  if (groupInput) groupInput.value = '';
  document.getElementById('lbFeedback').textContent = '';
  modal.hidden = false;
  document.getElementById('lbName').focus();
}

function closeLeaderboardModal() {
  document.getElementById('leaderboardModal').hidden = true;
}

function openEndSessionModal() {
  const modal = document.getElementById('endSessionModal');
  const score = appState.score;
  const completedCount = Object.keys(appState.completed).length;
  const total = exercises.length;
  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  const time = `${minutes}:${seconds}`;

  document.getElementById('endSessionScore').textContent = score;
  document.getElementById('endSessionCompleted').textContent = `${completedCount}/${total}`;
  document.getElementById('endSessionTime').textContent = time;
  document.getElementById('endSessionMessage').textContent = getEndSessionMessage(score, completedCount, total);

  const diplomaTopics = getDiplomaTopics();
  document.getElementById('diplomaTopics').innerHTML = diplomaTopics
    .map((topic) => `<li>${AppUtils.escapeHtml(topic)}</li>`)
    .join('');
  document.getElementById('diplomaDone').textContent = getDiplomaDoneText(completedCount);
  document.getElementById('diplomaRecipient').textContent = appState.userName || 'Aluno';
  document.getElementById('diplomaDate').textContent = new Date().toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  document.getElementById('endSessionName').value = appState.userName || '';
  modal.hidden = false;
}

function closeEndSessionModal() {
  document.getElementById('endSessionModal').hidden = true;
}

function confirmEndSession() {
  const name = document.getElementById('endSessionName').value.trim();
  if (!name) {
    alert('Por favor, escreve o teu nome para receber o diploma.');
    document.getElementById('endSessionName').focus();
    return;
  }

  const score = appState.score;
  const completedCount = Object.keys(appState.completed).length;
  const total = exercises.length;
  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  const time = `${minutes}:${seconds}`;
  const topics = getDiplomaTopics();
  const summary = getDiplomaDoneText(completedCount);

  appState.userName = name;
  appState.sessionEnded = true;
  appState.sessionSummary = {
    name,
    score,
    completed: completedCount,
    total,
    time,
    endedAt: new Date().toISOString(),
    topics,
    summary,
  };

  clearAllProgress();
  setFeedback('Sessão terminada! O progresso foi limpo e o diploma foi guardado.', 'success');
  closeEndSessionModal();
}

function clearAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
  appState = {
    activeTopicId: topics[0]?.id,
    activeExerciseId: exercises[0]?.id,
    score: 0,
    completed: {},
    codes: {},
    timeSpent: 0,
    timerPaused: false,
    userName: appState.userName || '',
  };
  saveState();
  activeExerciseId = appState.activeExerciseId;
  activeTopicId = appState.activeTopicId;
  renderExerciseList();
  renderActiveExercise();
}

function getDiplomaTopics() {
  const learned = topics.filter((topic) =>
    topic.exercises.some((exercise) => appState.completed[exercise.id])
  ).map((topic) => topic.title);

  if (!learned.length) {
    return ['Fundamentos de programação', 'Lógica condicional', 'Estruturas de repetição'];
  }

  return learned.slice(0, 4);
}

function getDiplomaDoneText(completedCount) {
  if (!completedCount) {
    return 'Iniciou a sessão e explorou os primeiros conceitos de programação no Verão ULisboa.';
  }
  if (completedCount === exercises.length) {
    return 'Concluiu todos os exercícios disponíveis nesta sessão, fortalecendo a compreensão de programação em TypeScript.';
  }
  return `Concluiu ${completedCount} exercícios desta sessão, praticando resolução de problemas e conceitos essenciais de programação.`;
}

function getEndSessionMessage(score, completedCount, total) {
  const ratio = total ? completedCount / total : 0;
  if (completedCount === total) {
    return 'Fantástico! Concluíste todos os exercícios. Partilha o teu sucesso com os teus amigos!';
  }
  if (score >= 200 || ratio >= 0.75) {
    return 'Muito bom! Já fizeste um grande progresso. Compartilha para inspirar outros.';
  }
  if (score >= 100 || ratio >= 0.5) {
    return 'Ótimo trabalho! Continua a praticar e partilha o que aprendeste.';
  }
  return 'Bom início! Continua a aprender e mostra aos teus amigos o teu progresso.';
}

function shareSession(network) {
  const score = appState.score;
  const completed = Object.keys(appState.completed).length;
  const total = exercises.length;
  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  const time = `${minutes}:${seconds}`;
  const text = `Acabei uma sessão de programação: ${score} pontos, ${completed}/${total} exercícios concluídos em ${time}! #VerãoULisboa #Programação`;
  const url = encodeURIComponent(window.location.href);
  const encodedText = encodeURIComponent(text + ' ' + window.location.href);

  if (network === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    return;
  }

  if (network === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    return;
  }
}

function copySessionLink() {
  const score = appState.score;
  const completed = Object.keys(appState.completed).length;
  const total = exercises.length;
  const minutes = String(Math.floor(appState.timeSpent / 60)).padStart(2, '0');
  const seconds = String(appState.timeSpent % 60).padStart(2, '0');
  const time = `${minutes}:${seconds}`;
  const text = `Acabei uma sessão de programação: ${score} pontos, ${completed}/${total} exercícios concluídos em ${time}! ${window.location.href}`;

  navigator.clipboard.writeText(text).then(() => {
    alert('Link e mensagem copiados para a área de transferência!');
  }).catch(() => {
    alert('Não foi possível copiar automaticamente. Seleciona e copia manualmente.');
  });
}

async function submitToLeaderboard(event) {
  event.preventDefault();
  const name = document.getElementById('lbName').value.trim();
  const emailInput = document.getElementById('lbEmail').value.trim();
  const group = document.getElementById('lbGroup')?.value.trim() || '';
  if (!name || !emailInput) return;

  const btn = document.querySelector('.modal-submit');
  btn.disabled = true;
  btn.textContent = 'A guardar na nuvem...';

  // Securely hash the email for the document ID (prevents duplication without exposing the email)
  let docId;
  try {
    docId = await hashEmail(emailInput);
  } catch (e) {
    // Fallback in case of environment limitation
    docId = btoa(emailInput.toLowerCase().trim()).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Mask the email so the plain-text email is NEVER stored in the database
  const maskedEmail = emailInput.replace(/(.{2}).*(@.*)/, '$1…$2');

  const entry = {
    name,
    email: maskedEmail, // Store masked email to ensure absolute privacy
    group,             // Optional class/group code
    score: appState.score,
    completed: Object.keys(appState.completed).length,
    total: exercises.length,
    timeSpent: appState.timeSpent,
    submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  try {
    const docRef = db.collection("leaderboard").doc(docId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      // Só atualiza se a pontuação atual for melhor
      if (entry.score >= data.score) {
        await docRef.update(entry);
      }
    } else {
      await docRef.set(entry);
    }

    document.getElementById('lbFeedback').style.color = '#157347';
    document.getElementById('lbFeedback').textContent = '✓ Pontuação guardada com sucesso!';
    
    setTimeout(() => {
      closeLeaderboardModal();
      window.open('leaderboard.html', '_blank');
      btn.disabled = false;
      btn.textContent = 'Submeter pontuação';
    }, 1200);
    
  } catch (err) {
    console.error('Erro ao guardar no Firebase:', err);
    document.getElementById('lbFeedback').style.color = '#b42318';
    document.getElementById('lbFeedback').textContent = 'Erro ao ligar à base de dados. Verificou o firebase-db.js?';
    btn.disabled = false;
    btn.textContent = 'Submeter pontuação';
  }
}

function handlePreviewMessage(event) {
  const msgType = event.data?.type;
  if (!msgType) return;

  if (msgType === 'console-write') {
    if (currentRunCanScore && terminalEnabledForActiveExercise()) {
      TerminalPanel.append(event.data.text);
    }
    return;
  }

  if (msgType === 'request-input') {
    if (currentRunCanScore && terminalEnabledForActiveExercise()) {
      TerminalPanel.showInput();
    }
    return;
  }

  if (msgType.startsWith('student-code-')) {
    handleStudentCodeResult(event.data);
  }
}

function handleStudentCodeResult(data) {
  const exercise = getActiveExercise();
  lastRunState = data.state || {};

  if (!currentRunCanScore) {
    setFeedback('Pronto para executar.', 'neutral');
    currentRunIsActive = false;
    syncRunControls();
    return;
  }

  currentRunIsActive = false;
  syncRunControls();

  if (data.type === 'student-code-error') {
    setFeedback(`Erro: ${data.message}`, 'wrong');
    if (!appState.failed) appState.failed = {};
    appState.failed[exercise.id] = true;
    saveState();
    renderExerciseList();
    return;
  }

  const validation = ExerciseValidator.evaluate(exercise, getEditor().value, lastRunState);
  if (validation.ok) {
    completeExercise(exercise);
    setFeedback(`Correto! Ganhaste ${exercise.points} pontos.`, 'correct');
    return;
  }

  setFeedback(validation.message, 'wrong');
  if (!appState.failed) appState.failed = {};
  appState.failed[exercise.id] = true;
  saveState();
  renderExerciseList();
}

function handleEditorKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runStudentCode();
    return;
  }

  handleEditorIndent(event);
}

function handleEditorIndent(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    const value = event.currentTarget.value;
    event.currentTarget.value = value.substring(0, start) + '  ' + value.substring(end);
    event.currentTarget.selectionStart = event.currentTarget.selectionEnd = start + 2;
    updateEditorHighlight();
    saveCurrentCode();
    return;
  }

  if (event.key !== 'Enter') return;

  event.preventDefault();
  const start = event.currentTarget.selectionStart;
  const end = event.currentTarget.selectionEnd;
  const value = event.currentTarget.value;
  const before = value.substring(0, start);
  const after = value.substring(end);
  const previousLine = before.split('\n').slice(-1)[0];
  const indent = previousLine.match(/^\s*/)[0];

  event.currentTarget.value = `${before}\n${indent}${after}`;
  event.currentTarget.selectionStart = event.currentTarget.selectionEnd = start + 1 + indent.length;
  updateEditorHighlight();
  saveCurrentCode();
}

let lastSavedTimeSpent = appState.timeSpent;

function startTimer() {
  setInterval(() => {
    if (!shouldCountTimer()) return;
    appState.timeSpent += 1;
    
    // Save to localStorage every 5 seconds to reduce disk writes
    if (appState.timeSpent - lastSavedTimeSpent >= 5) {
      saveState();
      lastSavedTimeSpent = appState.timeSpent;
    }
    updateHeader();
  }, 1000);
}

function initApp() {
  document.getElementById('solutionBtn').hidden = !ENABLE_SOLUTIONS;
  document.body.classList.toggle('lab-mode-facilitator', ENABLE_SOLUTIONS);
  document.body.classList.toggle('lab-mode-student', !ENABLE_SOLUTIONS);

  const editor = getEditor();
  editor.addEventListener('input', handleEditorInput);
  editor.addEventListener('scroll', syncEditorHighlightScroll);
  editor.addEventListener('keydown', handleEditorKeydown);
  editor.addEventListener('focus', () => { editorFocused = true; });
  editor.addEventListener('blur', () => { editorFocused = false; });

  document.addEventListener('visibilitychange', () => {
    tabVisible = document.visibilityState === 'visible';
  });

  document.getElementById('consoleForm').addEventListener('submit', (event) => {
    event.preventDefault();
    TerminalPanel.submitInput();
  });

  window.addEventListener('message', handlePreviewMessage);
  window.addEventListener('beforeunload', () => {
    if (!isRestarting) saveState();
  });

  syncTimerPauseButton();
  renderActiveExercise();
  syncRunControls();
  startTimer();
}

document.addEventListener('DOMContentLoaded', initApp);
