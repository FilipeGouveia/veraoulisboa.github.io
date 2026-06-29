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
    let textChanged = text.replace(/`([^`]+)`/g, (match, p1) => `<code class="highlighted-code">${this.highlightInlineCode(p1)}</code>`);
    if(text == textChanged)
      textChanged = text.replace(/\[((?:[^\[\]]|\[\])+)\]/g, (match, p1) => `<code class="highlighted-code">${this.highlightInlineCode(p1)}</code>`);
    return textChanged;
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
      // 1. Remove object type annotations like ": { x: number; y: number }" before "=", ";", or ","
      .replace(/:\s*\{\s*[\s\S]*?\}\s*(=|;|,)/g, '$1')
      // 2. Remove standard array types like ": string[]"
      .replace(/:\s*\w+(?:\[\])+/g, '')
      // 3. Remove function return type annotations like "): Point" or "): void"
      .replace(/\)\s*:\s*\w+\b/g, ')')
      // 4. Remove primitive type annotations like ": string", ": number"
      .replace(/:\s*(string|number|boolean|unknown|any|void)\b/g, '')
      // 5. Remove interface declarations
      .replace(/\binterface\s+\w+\s*{[\s\S]*?}\s*/g, '')
      // 6. Remove type alias declarations
      .replace(/\btype\s+\w+\s*=\s*[^;]+;/g, '');
  },
};
