window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'cifras-matematica',
  title: 'Cifras, Fórmulas e Pi',
  exercises: [
    {
      id: 'cesar',
      title: 'Mensagem secreta',
      points: 25,
      explanation: [
        'Uma cifra é uma forma de esconder uma mensagem. A ideia da cifra de César é trocar cada letra por outra letra mais à frente no alfabeto.',
        'No computador, cada letra tem um código numérico. Podemos ler esse código com [charCodeAt] e criar uma nova letra com [String.fromCharCode].',
        'Aqui usamos um deslocamento de 13. A letra F passa a S, C passa a P, U passa a b e L passa a Y. Por isso FCUL fica SPbY.',
      ],
      advanced: [
        'Cada caractere tem um número associado na tabela de caracteres (Unicode). [letra.charCodeAt(0)] dá-te esse número, e [String.fromCharCode(n)] faz o caminho inverso. Somar 13 ao código é o que "avança" a letra.',
        'Repara que esta cifra simples não trata do fim do alfabeto: somar 13 a algumas letras dá símbolos em vez de letras (é por isso que o U vira "b" minúsculo). As cifras a sério usam o resto da divisão ([%]) para "dar a volta" e ficar sempre dentro das letras.',
      ],
      instructions: [
        'Completa a função [cifrar].',
        'Percorre todas as letras do texto.',
        'Avança cada letra 13 posições.',
        'Usa [mostrarCifra(cifrar("FCUL"))].',
        'Muda a cor da mensagem cifrada para separar conteúdo e apresentação.',
      ],
      observation: 'O painel deve mostrar SPbY.',
      hint: 'Dentro do ciclo, transforma cada letra num código numérico, soma 13, e volta a transformar esse número numa letra.',
      starter: 'function cifrar(texto: string): string {\n  let resultado = "";\n\n  // percorre as letras aqui\n\n  return resultado;\n}\n\nmostrarCifra(cifrar("FCUL"));\nmudarCorCifra("#ffffff");',
      solution: 'function cifrar(texto: string): string {\n  let resultado = "";\n\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) + 13);\n  }\n\n  return resultado;\n}\n\nmostrarCifra(cifrar("FCUL"));\nmudarCorCifra("#ffffff");',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2>Cifra</h2>
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
        function mudarCorCifra(cor) {
          document.getElementById('cipher').style.color = String(cor);
          window.exerciseState.cipherColor = String(cor);
        }
      `,
      visualControls: [
        {
          label: 'Cor da cifra',
          type: 'color',
          defaultValue: '#ffffff',
          pattern: 'mudarCorCifra\\("([^"]+)"\\);?',
          template: (value) => `mudarCorCifra("${value}");`,
        },
      ],
      validate: (code, state) => state.cipher === 'SPbY',
    },
    {
      id: 'cesar-desencriptar',
      title: 'Desencriptar a mensagem',
      points: 20,
      explanation: [
        'Desencriptar é desfazer a cifra. Se para esconder a mensagem avançámos 13 posições, para recuperar a mensagem original temos de recuar 13 posições.',
        'Isto mostra uma ideia importante: algumas operações têm inversa. Somar pode ser desfeito com subtrair. Avançar na tabela de caracteres pode ser desfeito recuando.',
        'A mensagem SPbY foi obtida a partir de FCUL. O teu objetivo é voltar a FCUL.',
      ],
      instructions: [
        'Completa a função [decifrar].',
        'Percorre todas as letras do texto.',
        'Recua cada letra 13 posições.',
        'Mostra o resultado com mostrarTexto.',
      ],
      observation: 'O painel deve voltar a mostrar FCUL.',
      hint: 'Pensa na operação inversa da cifra anterior: se avançar escondia a mensagem, recuar recupera a mensagem.',
      starter: 'function decifrar(texto: string): string {\n  let resultado = "";\n\n  // percorre as letras aqui\n\n  return resultado;\n}\n\nmostrarTexto(decifrar("SPbY"));',
      solution: 'function decifrar(texto: string): string {\n  let resultado = "";\n\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) - 13);\n  }\n\n  return resultado;\n}\n\nmostrarTexto(decifrar("SPbY"));',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2>Mensagem</h2>
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
      points: 25,
      explanation: [
        'Algumas fórmulas parecem grandes, mas um programa pode dividi-las em passos pequenos. A fórmula resolvente encontra as soluções de uma equação do segundo grau.',
        'Para x² - 5x + 6 = 0, temos a = 1, b = -5 e c = 6. Primeiro calculamos delta. Depois usamos [Math.sqrt(delta)] para obter a raiz quadrada.',
        'O objetivo não é decorar a fórmula toda de uma vez. É perceber como transformar uma receita matemática numa sequência de variáveis.',
      ],
      instructions: [
        'Calcula [delta] usando b * b - 4 * a * c.',
        'Calcula as duas raízes.',
        'Usa [mostrarEquacao(a, b, c)] para atualizar o título.',
        'Usa [mostrarRaizes(raiz1, raiz2)].',
      ],
      observation: 'As raízes esperadas são 2 e 3.',
      hint: 'Calcula uma variável de cada vez: primeiro delta, depois a raiz quadrada de delta, e só no fim as duas raízes.',
      starter: 'const a: number = 1;\nconst b: number = -5;\nconst c: number = 6;\n\n// calcula delta e as raízes\n\nmostrarEquacao(a, b, c);\n// mostra as raízes aqui',
      solution: 'const a: number = 1;\nconst b: number = -5;\nconst c: number = 6;\n\nconst delta: number = b * b - 4 * a * c;\nconst raiz1: number = (-b - Math.sqrt(delta)) / (2 * a);\nconst raiz2: number = (-b + Math.sqrt(delta)) / (2 * a);\n\nmostrarEquacao(a, b, c);\nmostrarRaizes(raiz1, raiz2);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2 id="equation">x² - 5x + 6 = 0</h2>
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
        'A posição é descrita por duas coordenadas: x na horizontal e y na vertical. [Math.random()] dá um número entre 0 e 1, perfeito para escolher posições dentro de um quadrado de lado 1.',
        'Antes de contar muitos dardos, vamos desenhar pontos para perceber o que x e y significam. A função [criarPonto] cria um novo ponto de cada vez.',
      ],
      instructions: [
        'Cria x e y usando [Math.random()].',
        'Chama [criarPonto(x, y)].',
        'Se quiseres, chama [criarPonto] várias vezes para desenhar vários pontos.',
        'Experimenta mudar a cor e o raio dos pontos.',
      ],
      observation: 'Cada chamada a [criarPonto] desenha mais um ponto dentro do quadrado.',
      hint: '[Math.random()] cria um número entre 0 e 1. Usa essa ideia uma vez para x e outra para y, depois passa os dois valores a [criarPonto].',
      starter: '// cria x e y com [Math.random]\n\n// cria o ponto aqui\n\nmudarCorPonto("#d97706");\nmudarRaioPonto(7);',
      solution: 'const x: number = Math.random();\nconst y: number = Math.random();\ncriarPonto(x, y);\nmudarCorPonto("#d97706");\nmudarRaioPonto(7);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Ponto aleatório</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: `
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const points = [];
        let pointColor = '#d97706';
        let pointRadius = 7;
        window.exerciseState.points = [];
        function drawBoard() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#0077b6';
          ctx.strokeRect(80, 30, 300, 300);
          ctx.beginPath();
          ctx.arc(80, 330, 300, -Math.PI / 2, 0);
          ctx.stroke();
        }
        function redrawPoints() {
          drawBoard();
          ctx.fillStyle = pointColor;
          for (const point of points) {
            ctx.beginPath();
            ctx.arc(80 + point.x * 300, 330 - point.y * 300, pointRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        drawBoard();
        function criarPonto(x, y) {
          const px = Number(x);
          const py = Number(y);
          points.push({ x: px, y: py });
          redrawPoints();
          window.exerciseState.x = px;
          window.exerciseState.y = py;
          window.exerciseState.points.push({ x: px, y: py });
        }
        function mostrarPonto(x, y) {
          criarPonto(x, y);
        }
        function mudarCorPonto(cor) {
          pointColor = String(cor);
          redrawPoints();
          window.exerciseState.pointColor = pointColor;
        }
        function mudarRaioPonto(raio) {
          pointRadius = Number(raio);
          redrawPoints();
          window.exerciseState.pointRadius = pointRadius;
        }
      `,
      visualControls: [
        {
          label: 'Cor do ponto',
          type: 'color',
          defaultValue: '#d97706',
          pattern: 'mudarCorPonto\\("([^"]+)"\\);?',
          template: (value) => `mudarCorPonto("${value}");`,
        },
        {
          label: 'Raio do ponto',
          type: 'range',
          min: 3,
          max: 18,
          step: 1,
          defaultValue: 7,
          pattern: 'mudarRaioPonto\\((\\d+)\\);?',
          template: (value) => `mudarRaioPonto(${value});`,
        },
      ],
      validate: (code, state) => /Math\.random/.test(code) && /criarPonto/.test(code) && (state.points || []).some((point) => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1),
    },
    {
      id: 'pi',
      title: 'Dardos para descobrir pi',
      points: 30,
      explanation: [
        'Uma forma divertida de aproximar pi é lançar muitos pontos aleatórios para um quadrado e contar quantos ficam dentro de um quarto de círculo.',
        'O quadrado tem área 1. O quarto de círculo ocupa uma parte dessa área. A razão entre pontos dentro do círculo e pontos totais aproxima a razão entre as áreas.',
        'Na pergunta anterior criaste um ponto com x e y. Agora vais repetir essa ideia muitas vezes: cada ponto é um dardo. Quando multiplicamos a razão de pontos dentro por 4, obtemos uma aproximação de pi.',
      ],
      advanced: [
        'Porquê multiplicar por 4? O quarto de círculo tem área [pi/4] e o quadrado tem área 1. A fração de dardos que cai dentro do quarto de círculo aproxima [pi/4], por isso multiplicamos por 4 para chegar a [pi].',
        'Este método chama-se simulação de Monte Carlo. Quanto mais dardos lançares, mais perto de [pi] tende a ficar a estimativa — é a lei dos grandes números em ação. Com poucos dardos, o valor oscila bastante.',
      ],
      instructions: [
        'Cria total com pelo menos 1000 dardos.',
        'Cria uma variável dentro que começa em 0.',
        'Usa um ciclo for para gerar x e y com [Math.random()].',
        'Dentro do ciclo, chama [criarPonto(x, y)].',
        'Se [pontoDentro(x, y)] for [true], aumenta dentro.',
        'Calcula pi com 4 * dentro / total.',
        'Mostra o valor com [mostrarPi(pi)].',
        'Altera a cor da barra para veres um detalhe gráfico controlado por código.',
      ],
      observation: 'Deves ver muitos pontos no quadrado. O valor não será sempre igual, mas deve ficar perto de 3.14.',
      hint: 'Este exercício é a pergunta 20 dentro de um ciclo. Para cada dardo, cria x e y, desenha o ponto, testa se está dentro, e só no fim calcula pi.',
      starter: 'const total: number = 0;\nlet dentro: number = 0;\n\n// cria um ciclo para lançar os dardos\n\nconst pi: number = 0;\nmostrarPi(pi);\nmudarCorBarra("#0077b6");',
      solution: 'const total: number = 5000;\nlet dentro: number = 0;\n\nfor (let i = 0; i < total; i++) {\n  const x: number = Math.random();\n  const y: number = Math.random();\n  criarPonto(x, y);\n\n  if (pontoDentro(x, y)) {\n    dentro = dentro + 1;\n  }\n}\n\nconst pi: number = 4 * dentro / total;\nmostrarPi(pi);\nmudarCorBarra("#0077b6");',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Pi aproximado</h2>
            <canvas id="canvas" width="520" height="260"></canvas>
            <div class="big-value" id="pi">?</div>
            <div class="meter"><span id="pi-meter"></span></div>
          </section>
        </main>
      `,
      api: `
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        window.exerciseState.total = 0;
        window.exerciseState.inside = 0;
        function drawBoard() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = '#0077b6';
          ctx.strokeRect(70, 20, 220, 220);
          ctx.beginPath();
          ctx.arc(70, 240, 220, -Math.PI / 2, 0);
          ctx.stroke();
        }
        drawBoard();
        function pontoDentro(x, y) {
          return Number(x) * Number(x) + Number(y) * Number(y) <= 1;
        }
        function criarPonto(x, y) {
          const px = Number(x);
          const py = Number(y);
          const inside = pontoDentro(px, py);
          ctx.fillStyle = inside ? '#16a34a' : '#dc2626';
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(70 + px * 220, 240 - py * 220, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          window.exerciseState.total++;
          if (inside) window.exerciseState.inside++;
        }
        function mostrarPi(valor) {
          const pi = Number(valor);
          setText('pi', Number.isFinite(pi) ? pi.toFixed(4) : '?');
          document.getElementById('pi-meter').style.width = Math.min(100, Math.max(0, pi / Math.PI * 100)) + '%';
          window.exerciseState.pi = pi;
        }
        function mudarCorBarra(cor) {
          document.getElementById('pi-meter').style.background = String(cor);
          window.exerciseState.meterColor = String(cor);
        }
      `,
      visualControls: [
        {
          label: 'Cor da barra',
          type: 'color',
          defaultValue: '#0077b6',
          pattern: 'mudarCorBarra\\("([^"]+)"\\);?',
          template: (value) => `mudarCorBarra("${value}");`,
        },
      ],
      validate: (code, state) =>
        /\bfor\s*\(/.test(code) &&
        /Math\.random/.test(code) &&
        /criarPonto/.test(code) &&
        /pontoDentro/.test(code) &&
        state.total >= 1000 &&
        Math.abs(state.pi - Math.PI) < 0.25,
    },
  ],
});
