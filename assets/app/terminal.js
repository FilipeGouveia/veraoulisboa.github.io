window.TerminalPanel = (() => {
  let enabled = false;

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    document.querySelector('.preview-shell')?.classList.toggle('terminal-disabled', !enabled);
    if (!enabled) clear();
  }

  function clear() {
    const consoleEl = document.getElementById('console');
    const output = document.getElementById('consoleOutput');
    const form = document.getElementById('consoleForm');
    const status = document.getElementById('consoleStatus');

    output.innerHTML = '';
    form.hidden = true;
    status.textContent = '';
    consoleEl.hidden = true;
  }

  function show() {
    if (!enabled) return;
    document.getElementById('console').hidden = false;
  }

  function hide() {
    document.getElementById('console').hidden = true;
  }

  function append(text, type = 'output') {
    if (!enabled) return;
    show();
    const output = document.getElementById('consoleOutput');
    const line = document.createElement('div');
    line.className = 'console-line ' + type;
    line.textContent = text;
    output.appendChild(line);

    // Defer scrolling to ensure DOM has updated
    requestAnimationFrame(() => {
      output.scrollTop = output.scrollHeight;
    });
  }

  function showInput() {
    if (!enabled) return;
    show();
    const form = document.getElementById('consoleForm');
    const input = document.getElementById('consoleInput');
    const status = document.getElementById('consoleStatus');
    form.hidden = false;
    status.textContent = 'À espera de input…';
    input.value = '';
    input.focus();
  }

  function submitInput() {
    if (!enabled) return;
    const input = document.getElementById('consoleInput');
    const form = document.getElementById('consoleForm');
    const status = document.getElementById('consoleStatus');
    const value = input.value;

    append('▸ ' + value, 'input-echo');
    form.hidden = true;
    status.textContent = '';
    input.value = '';

    document.getElementById('preview').contentWindow.postMessage({ type: 'provide-input', value }, '*');
  }

  return {
    append,
    clear,
    setEnabled,
    showInput,
    submitInput,
  };
})();
