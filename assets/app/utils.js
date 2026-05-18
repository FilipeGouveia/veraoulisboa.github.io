window.AppUtils = {
  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  formatText(value) {
    if (!value) return '';
    let text = this.escapeHtml(value);
    text = text.replace(/\[((?:[^\[\]]|\[\])+)\]/g, (match, p1) => `<code class="highlighted-code">${this.highlightInlineCode(p1)}</code>`);
    text = text.replace(/`([^`]+)`/g, (match, p1) => `<code class="highlighted-code">${this.highlightInlineCode(p1)}</code>`);
    return text;
  },

  highlightInlineCode(code) {
    const raw = code
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    const tokenPattern = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|default|do|else|finally|for|function|if|in|let|new|null|return|switch|try|var|while)\b|\b(?:any|boolean|number|string|unknown|void|undefined|true|false|null|Infinity)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*(?=\s*\()|\b[A-Za-z_$][\w$]*\b|[+\-*/%=<>!&|?:]+)/g;
    
    let html = '';
    let cursor = 0;
    let match;
    
    while ((match = tokenPattern.exec(raw)) !== null) {
      const token = match[0];
      html += this.escapeHtml(raw.slice(cursor, match.index));
      
      let className = '';
      if (/^\/\//.test(token) || /^\/\*/.test(token)) {
        className = 'syntax-comment';
      } else if (/^["'`]/.test(token)) {
        className = 'syntax-string';
      } else if (/^\d/.test(token)) {
        className = 'syntax-number';
      } else if (/^(any|boolean|number|string|unknown|void|undefined|true|false|null|Infinity)$/.test(token)) {
        className = 'syntax-type';
      } else if (/^(async|await|break|case|catch|class|const|continue|default|do|else|finally|for|function|if|in|let|new|null|return|switch|try|var|while)$/.test(token)) {
        className = 'syntax-keyword';
      } else if (/^[A-Za-z_$][\w$]*(?=\s*\()/.test(token)) {
        className = 'syntax-function';
      } else if (/^[+\-*/%=<>!&|?:]+$/.test(token)) {
        className = 'syntax-operator';
      }
      
      if (className) {
        html += `<span class="${className}">${this.escapeHtml(token)}</span>`;
      } else {
        html += this.escapeHtml(token);
      }
      cursor = match.index + token.length;
    }
    
    html += this.escapeHtml(raw.slice(cursor));
    return html;
  },

  stripTypeScript(code) {
    return code
      .replace(/:\s*\w+(?:\[\])+/g, '')
      .replace(/:\s*(string|number|boolean|unknown|any|void)\b/g, '')
      .replace(/\)\s*:\s*(void|string|number|boolean|unknown|any)\s*{/g, ') {')
      .replace(/\binterface\s+\w+\s*{[\s\S]*?}\s*/g, '')
      .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '');
  },
};
