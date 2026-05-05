window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'cifras-matematica',
  title: 'Cifras, Fórmulas e Pi',
  exercises: [
    {
      id: 'cesar',
      title: 'Mensagem secreta',
      points: 20,
      explanation: [
        'Uma cifra é uma forma de esconder uma mensagem. A ideia da cifra de César é trocar cada letra por outra letra mais à frente no alfabeto.',
        'No computador, cada letra tem um código numérico. Podemos ler esse código com charCodeAt e criar uma nova letra com String.fromCharCode.',
        'Aqui usamos um deslocamento de 13. A letra F passa a S, C passa a P, U passa a H e L passa a Y. Por isso FCUL fica SPHY.',
      ],
      instructions: [
        'Completa a função cifrar.',
        'Percorre todas as letras do texto.',
        'Avança cada letra 13 posições.',
        'Usa mostrarCifra(cifrar("FCUL")).',
      ],
      observation: 'O painel deve mostrar SPHY.',
      hint: 'Dentro do ciclo, transforma cada letra num código numérico, soma 13, e volta a transformar esse número numa letra.',
      starter: 'function cifrar(texto: string): string {\n  let resultado = "";\n\n  // percorre as letras aqui\n\n  return resultado;\n}\n\nmostrarCifra(cifrar("FCUL"));',
      solution: 'function cifrar(texto: string): string {\n  let resultado = "";\n\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) + 13);\n  }\n\n  return resultado;\n}\n\nmostrarCifra(cifrar("FCUL"));',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h1>Cifra</h1>
            <div class="big-value" id="cipher">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrarCifra(texto) {
          const cipher = String(texto);
          setText('cipher', cipher);
          window.exerciseState.cipher = cipher;
        }
      `,
      validate: (code, state) => state.cipher === 'SPHY',
    },
    {
      id: 'cesar-desencriptar',
      title: 'Desencriptar a mensagem',
      points: 20,
      explanation: [
        'Desencriptar é desfazer a cifra. Se para esconder a mensagem avançámos 13 posições, para recuperar a mensagem original temos de recuar 13 posições.',
        'Isto mostra uma ideia importante: algumas operações têm inversa. Somar pode ser desfeito com subtrair. Avançar na tabela de caracteres pode ser desfeito recuando.',
        'A mensagem SPHY foi obtida a partir de FCUL. O teu objetivo é voltar a FCUL.',
      ],
      instructions: [
        'Completa a função decifrar.',
        'Percorre todas as letras do texto.',
        'Recua cada letra 13 posições.',
        'Mostra o resultado com mostrarTexto.',
      ],
      observation: 'O painel deve voltar a mostrar FCUL.',
      hint: 'Pensa na operação inversa da cifra anterior: se avançar escondia a mensagem, recuar recupera a mensagem.',
      starter: 'function decifrar(texto: string): string {\n  let resultado = "";\n\n  // percorre as letras aqui\n\n  return resultado;\n}\n\nmostrarTexto(decifrar("SPHY"));',
      solution: 'function decifrar(texto: string): string {\n  let resultado = "";\n\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) - 13);\n  }\n\n  return resultado;\n}\n\nmostrarTexto(decifrar("SPHY"));',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h1>Mensagem</h1>
            <div class="big-value" id="plain">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrarTexto(texto) {
          const plain = String(texto);
          setText('plain', plain);
          window.exerciseState.plain = plain;
        }
      `,
      validate: (code, state) => state.plain === 'FCUL',
    },
    {
      id: 'formula',
      title: 'Raízes da equação',
      points: 20,
      explanation: [
        'Algumas fórmulas parecem grandes, mas um programa pode dividi-las em passos pequenos. A fórmula resolvente encontra as soluções de uma equação do segundo grau.',
        'Para x² - 5x + 6 = 0, temos a = 1, b = -5 e c = 6. Primeiro calculamos delta. Depois usamos Math.sqrt(delta) para obter a raiz quadrada.',
        'O objetivo não é decorar a fórmula toda de uma vez. É perceber como transformar uma receita matemática numa sequência de variáveis.',
      ],
      instructions: [
        'Calcula delta usando b * b - 4 * a * c.',
        'Calcula as duas raízes.',
        'Usa mostrarEquacao(a, b, c) para atualizar o título.',
        'Usa mostrarRaizes(raiz1, raiz2).',
      ],
      observation: 'As raízes esperadas são 2 e 3.',
      hint: 'Calcula uma variável de cada vez: primeiro delta, depois a raiz quadrada de delta, e só no fim as duas raízes.',
      starter: 'const a: number = 1;\nconst b: number = -5;\nconst c: number = 6;\n\n// calcula delta e as raízes\n\nmostrarEquacao(a, b, c);\n// mostra as raízes aqui',
      solution: 'const a: number = 1;\nconst b: number = -5;\nconst c: number = 6;\n\nconst delta: number = b * b - 4 * a * c;\nconst raiz1: number = (-b - Math.sqrt(delta)) / (2 * a);\nconst raiz2: number = (-b + Math.sqrt(delta)) / (2 * a);\n\nmostrarEquacao(a, b, c);\nmostrarRaizes(raiz1, raiz2);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1 id="equation">x² - 5x + 6 = 0</h1>
            <p>Raízes:</p>
            <div class="big-value" id="roots">?</div>
          </section>
        </main>
      `,
      api: `
        function formatTerm(value, letter, isFirst) {
          const number = Number(value);
          if (number === 0) return '';
          const sign = number > 0 ? (isFirst ? '' : ' + ') : ' - ';
          const abs = Math.abs(number);
          const coefficient = abs === 1 && letter ? '' : abs;
          return sign + coefficient + letter;
        }
        function mostrarEquacao(a, b, c) {
          const parts = [
            formatTerm(a, 'x²', true),
            formatTerm(b, 'x', false),
            formatTerm(c, '', false),
          ].filter(Boolean).join('');
          setText('equation', (parts || '0') + ' = 0');
          window.exerciseState.equation = [Number(a), Number(b), Number(c)];
        }
        function mostrarRaizes(a, b) {
          const roots = [Number(a), Number(b)].sort((x, y) => x - y);
          setText('roots', roots.map((root) => root.toFixed(0)).join(' e '));
          window.exerciseState.roots = roots;
        }
      `,
      validate: (code, state) => {
        const roots = state.roots || [];
        return Math.abs(roots[0] - 2) < 0.001 && Math.abs(roots[1] - 3) < 0.001 && /Math\.sqrt/.test(code) && Array.isArray(state.equation);
      },
    },
    {
      id: 'pi-coordenadas',
      title: 'Dardos com x e y',
      points: 15,
      explanation: [
        'Para aproximar pi com dardos, começamos por imaginar um quadrado. Cada dardo cai numa posição dentro desse quadrado.',
        'A posição é descrita por duas coordenadas: x na horizontal e y na vertical. Math.random() dá um número entre 0 e 1, perfeito para escolher posições dentro de um quadrado de lado 1.',
        'Antes de contar muitos dardos, vamos só desenhar um ponto para perceber o que x e y significam.',
      ],
      instructions: [
        'Cria x e y usando Math.random().',
        'Chama mostrarPonto(x, y).',
      ],
      observation: 'O ponto deve aparecer dentro do quadrado. Ao executar de novo, aparece noutra posição.',
      hint: 'Math.random() cria um número entre 0 e 1. Usa essa ideia uma vez para x e outra para y.',
      starter: '// cria x e y com Math.random\n\n// mostra o ponto aqui',
      solution: 'const x: number = Math.random();\nconst y: number = Math.random();\nmostrarPonto(x, y);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Ponto aleatório</h1>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: `
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#0077b6';
        ctx.strokeRect(80, 30, 300, 300);
        ctx.beginPath();
        ctx.arc(80, 330, 300, -Math.PI / 2, 0);
        ctx.stroke();
        function mostrarPonto(x, y) {
          const px = Number(x);
          const py = Number(y);
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(80 + px * 300, 330 - py * 300, 7, 0, Math.PI * 2);
          ctx.fill();
          window.exerciseState.x = px;
          window.exerciseState.y = py;
        }
      `,
      validate: (code, state) => /Math\.random/.test(code) && state.x >= 0 && state.x <= 1 && state.y >= 0 && state.y <= 1,
    },
    {
      id: 'pi',
      title: 'Dardos para descobrir pi',
      points: 20,
      explanation: [
        'Uma forma divertida de aproximar pi é lançar muitos pontos aleatórios para um quadrado e contar quantos ficam dentro de um quarto de círculo.',
        'O quadrado tem área 1. O quarto de círculo ocupa uma parte dessa área. A razão entre pontos dentro do círculo e pontos totais aproxima a razão entre as áreas.',
        'Quando multiplicamos essa razão por 4, obtemos uma aproximação de pi. Quanto mais dardos usarmos, mais estável tende a ficar o resultado.',
      ],
      instructions: [
        'Usa estimarPi(total) com pelo menos 1000 dardos.',
        'Guarda o resultado numa variável pi.',
        'Mostra o valor com mostrarPi(pi).',
      ],
      observation: 'O valor não será sempre igual. Deve ficar perto de 3.14.',
      hint: 'Escolhe um total grande, usa estimarPi(total), guarda o valor numa variável e mostra essa variável.',
      starter: 'const total: number = 0;\nconst pi: number = 0;\nmostrarPi(pi);',
      solution: 'const total: number = 5000;\nconst pi: number = estimarPi(total);\nmostrarPi(pi);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Pi aproximado</h1>
            <div class="big-value" id="pi">?</div>
            <div class="meter"><span id="pi-meter"></span></div>
          </section>
        </main>
      `,
      api: `
        function estimarPi(total) {
          let dentro = 0;
          const tries = Number(total);
          for (let i = 0; i < tries; i++) {
            const x = Math.random();
            const y = Math.random();
            if (x * x + y * y <= 1) dentro++;
          }
          window.exerciseState.total = tries;
          return 4 * dentro / tries;
        }
        function mostrarPi(valor) {
          const pi = Number(valor);
          setText('pi', Number.isFinite(pi) ? pi.toFixed(4) : '?');
          document.getElementById('pi-meter').style.width = Math.min(100, Math.max(0, pi / Math.PI * 100)) + '%';
          window.exerciseState.pi = pi;
        }
      `,
      validate: (code, state) => state.total >= 1000 && Math.abs(state.pi - Math.PI) < 0.25,
    },
  ],
});
