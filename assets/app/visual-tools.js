window.VisualTools = (() => {
  function getControls(exercise) {
    return exercise.visualControls || [];
  }

  function annotateCode(exercise, code) {
    const controls = getControls(exercise);
    if (!controls.length || code.includes('// Configuração gráfica')) return code;

    const lines = code.split('\n');
    const firstVisualIndex = lines.findIndex((line) => controls.some((control) => {
      const trimmed = line.trim();
      if (/^mudar[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(trimmed)) return true;
      if (/^donatello\.(speed|position|color|width)\(/.test(trimmed)) return true;
      if (!control.pattern) return false;
      return new RegExp(control.pattern).test(trimmed);
    }));

    if (firstVisualIndex === -1) return code;
    lines.splice(firstVisualIndex, 0, '\n\n// Configuração gráfica');
    return lines.join('\n');
  }

  function getControlValueFromCode(control, code) {
    if (!control.pattern) return control.defaultValue || '';
    const match = code.match(new RegExp(control.pattern));
    return match?.[1] ?? control.defaultValue ?? '';
  }

  function render(exercise, editor) {
    const tools = document.getElementById('visualTools');
    const controls = getControls(exercise);

    if (!controls.length) {
      tools.hidden = true;
      tools.innerHTML = '';
      return;
    }

    const code = editor.value;
    tools.hidden = false;
    tools.innerHTML = `
      <div class="visual-tools-header">
        <span class="visual-tools-title">Configurações Visuais</span>
      </div>
      <div class="visual-control-grid">
        ${controls.map((control, index) => renderControl(control, index, code)).join('')}
      </div>
    `;
  }

  function renderControl(control, index, code) {
    const value = AppUtils.escapeHtml(getControlValueFromCode(control, code));
    const attrs = `id="visual-control-${index}" onchange="applyVisualControl(${index}, this.value)" oninput="applyVisualControl(${index}, this.value)"`;
    const label = `<label for="visual-control-${index}">${AppUtils.escapeHtml(control.label)}</label>`;

    if (control.type === 'color') {
      return `<div class="visual-control">${label}<input type="color" value="${value}" ${attrs}></div>`;
    }

    if (control.type === 'range') {
      return `<div class="visual-control">${label}<input type="range" min="${control.min}" max="${control.max}" step="${control.step || 1}" value="${value}" ${attrs}></div>`;
    }

    if (control.type === 'select') {
      const options = (control.options || []).map((option) => (
        `<option value="${AppUtils.escapeHtml(option.value)}" ${String(option.value) === String(value) ? 'selected' : ''}>${AppUtils.escapeHtml(option.label)}</option>`
      )).join('');
      return `<div class="visual-control">${label}<select ${attrs}>${options}</select></div>`;
    }

    return `<div class="visual-control">${label}<input type="text" value="${value}" ${attrs}></div>`;
  }

  function apply(exercise, editor, index, value) {
    const control = getControls(exercise)[index];
    if (!control) return false;

    const nextCall = control.template(value);
    const pattern = control.pattern ? new RegExp(control.pattern) : null;

    if (pattern && pattern.test(editor.value)) {
      editor.value = editor.value.replace(pattern, nextCall);
      return true;
    }

    const prefix = editor.value.includes('// Configuração gráfica') ? '' : '\n// Configuração gráfica';
    editor.value = `${editor.value.trimEnd()}${prefix}\n${nextCall}`;
    return true;
  }

  return {
    annotateCode,
    apply,
    render,
  };
})();
