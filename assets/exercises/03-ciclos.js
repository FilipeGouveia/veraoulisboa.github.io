window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'ciclos',
  title: 'Decisões, Ciclos e Jogos',
  exercises: [
    {
      id: 'listas',
      advanced: [
        'Uma lista (array) guarda os elementos por ordem e cada um tem um índice que começa em 0. O [for...of] percorre os valores diretamente; existe também o [for] clássico com um contador para quando precisas do índice.',
      ],
      title: 'Galeria de frutas',
      points: 15,
      explanation: [
        'Uma lista guarda vários valores no mesmo sítio. Em vez de ter fruta1, fruta2 e fruta3, podemos ter uma única variável chamada frutas que contém todos esses textos.',
        'Um ciclo for serve para repetir uma ação. Quando escrevemos [for (const fruta of frutas)], estamos a dizer: para cada fruta que existir na lista, faz o bloco de código entre chavetas.',
        'Esta combinação, lista + ciclo, é uma das ferramentas mais importantes da programação. Permite fazer a mesma coisa a muitos valores sem copiar e colar linhas de código.',
      ],
      animation: `
        <div class="al">
          <style>
            .al{font-family:Inter,system-ui,sans-serif;text-align:center}
            .al .item{display:inline-block;margin:4px;padding:8px 12px;border-radius:8px;background:#e8eef7;font-weight:800;opacity:0;animation:alPop 4s infinite}
            .al .i2{animation-delay:.7s}.al .i3{animation-delay:1.4s}
            @keyframes alPop{0%,3%{opacity:0;transform:scale(.6)}13%,92%{opacity:1;transform:scale(1)}100%{opacity:1}}
            .al .lbl{font-size:13px;color:#64748b;font-weight:700;margin-top:10px}
          </style>
          <div>
            <span class="item i1">🍎 maçã</span><span class="item i2">🍌 banana</span><span class="item i3">🥝 kiwi</span>
          </div>
          <div class="lbl">for (const fruta of frutas) → uma etiqueta de cada vez</div>
        </div>
      `,
      instructions: [
        'Cria uma lista com pelo menos 3 frutas.',
        'Usa um ciclo [for].',
        'Dentro do ciclo, chama [adicionarFruta(fruta)].',
        'Muda a cor e o tamanho das etiquetas para veres essas escolhas no código.',
      ],
      observation: 'Cada elemento da lista deve aparecer como uma etiqueta no painel.',
      hint: 'Cria a lista primeiro. Depois usa um ciclo [`for...of`] para passar por cada fruta e chama [adicionarFruta] dentro do ciclo. As frutas devem ser strings, e o `of` no `for...of` significa “para cada elemento da lista”.',
      starter: 'const frutas: string[] = [];\n\n// cria o ciclo aqui\n\nmudarCorEtiquetas("#e8eef7");\nmudarTamanhoEtiquetas(16);',
      solution: 'const frutas: string[] = ["maçã", "banana", "kiwi"];\n\nfor (const fruta of frutas) {\n  adicionarFruta(fruta);\n}\n\nmudarCorEtiquetas("#e8eef7");\nmudarTamanhoEtiquetas(16);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Frutas</h2>
            <ul class="pill-row" id="fruits"></ul>
          </section>
        </main>
      `,
      api: `
        function adicionarFruta(fruta) {
          const text = String(fruta).trim();
          if (!text) return;
          const li = document.createElement('li');
          li.draggable = true;
          li.textContent = text;
          li.addEventListener('dragstart', () => {
            window.draggedFruit = li;
          });
          li.addEventListener('dragover', (event) => {
            event.preventDefault();
          });
          li.addEventListener('drop', (event) => {
            event.preventDefault();
            if (window.draggedFruit && window.draggedFruit !== li) {
              li.parentNode.insertBefore(window.draggedFruit, li);
            }
          });
          document.getElementById('fruits').appendChild(li);
          window.exerciseState.fruits = [...(window.exerciseState.fruits || []), text];
        }
        function mudarCorEtiquetas(cor) {
          document.querySelectorAll('#fruits li').forEach((item) => item.style.background = String(cor));
          window.exerciseState.tagColor = String(cor);
        }
        function mudarTamanhoEtiquetas(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('#fruits li').forEach((item) => item.style.fontSize = size + 'px');
          window.exerciseState.tagSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor das etiquetas',
          type: 'color',
          defaultValue: '#e8eef7',
          pattern: 'mudarCorEtiquetas\\("([^"]+)"\\);?',
          template: (value) => `mudarCorEtiquetas("${value}");`,
        },
        {
          label: 'Tamanho das etiquetas',
          type: 'range',
          min: 12,
          max: 26,
          step: 1,
          defaultValue: 16,
          pattern: 'mudarTamanhoEtiquetas\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoEtiquetas(${value});`,
        },
      ],
      validate: (code, state) => /\bfor\s*\(/.test(code) && (state.fruits || []).length >= 3,
    },
    {
      id: 'aleatorio',
      animation: '<div class="cax"><div class="lbl">numeroAleatorio(1, 6)</div><div class="big"><span class="cax-pop">🎲</span> <span class="accent cax-step d1">4</span></div><div class="lbl">um valor ao calhas entre 1 e 6</div></div>',
      title: 'Lançar o dado',
      points: 10,
      explanation: [
        'Às vezes queremos que o programa não faça sempre a mesma coisa. Jogos, simulações e sorteios usam números aleatórios para criar variedade.',
        'Neste exercício, a função [numeroAleatorio(1, 6)] devolve um número entre 1 e 6, como se estivesses a lançar um dado.',
        'Guarda esse valor numa variável e depois mostra-o. Assim separas o momento de gerar o número do momento de o apresentar.',
      ],
      advanced: [
        '[Math.random()] (que [numeroAleatorio] usa por baixo) não devolve números verdadeiramente aleatórios: são números pseudo-aleatórios, calculados por uma fórmula que parte de um valor inicial. Parecem aleatórios, mas são deterministas.',
        'Para transformar um número entre 0 e 1 num inteiro entre [min] e [max], multiplicamos pelo tamanho do intervalo, arredondamos para baixo com [Math.floor] e somamos o mínimo. É exatamente o que [numeroAleatorio] faz.',
      ],
      instructions: [
        'Usa [numeroAleatorio(1, 6)] para gerar o valor do dado.',
        'Guarda esse valor numa variável do tipo number.',
        'Mostra esse valor com [mostrarDado].',
        'Muda a cor e o tamanho do dado para perceberes como o estilo também pode vir do código.',
      ],
      observation: 'Se executares várias vezes, o número pode mudar. Isso é esperado. Chame a função [adicionarDado(...)] que recebe um número e veja o que acontece.',
      hint: 'Usa [numeroAleatorio] com mínimo 1 e máximo 6. Guarda o resultado numa variável antes de o mostrar.',
      starter: '// cria a variável dado aqui\n// depois mostra o valor\n\nmudarCorDado("#0077b6");\nmudarTamanhoDado(78);',
      solution: 'const dado: number = numeroAleatorio(1, 6);\nmostrarDado(dado);\nmudarCorDado("#0077b6");\nmudarTamanhoDado(78);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Dado</h2>
            <div id="dice-container" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
              <div class="big-value" id="die" style="font-size: 78px; line-height: 1;">?</div>
            </div>
          </section>
        </main>
      `,
      api: `
        function numeroAleatorio(min, max) {
          const low = Math.ceil(Number(min));
          const high = Math.floor(Number(max));
          return Math.floor(Math.random() * (high - low + 1)) + low;
        }
        function mostrarDado(valor) {
          const container = document.getElementById('dice-container');
          container.innerHTML = '<div class="big-value" id="die" style="font-size: ' + (window.exerciseState.dieSize || 78) + 'px; line-height: 1; color: ' + (window.exerciseState.dieColor || '#1f2937') + '">?</div>';
          
          const dieValue = Number(valor);
          const dieElem = document.getElementById('die');
          const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
          
          const interval = setInterval(() => {
            const randomFace = faces[Math.floor(Math.random() * 6)];
            dieElem.textContent = randomFace;
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
            const face = dieValue >= 1 && dieValue <= 6 ? faces[dieValue - 1] : dieValue;
            dieElem.textContent = face;
            void dieElem.offsetWidth;
            dieElem.classList.add('rolling');
          }, 1000);

          window.exerciseState.die = dieValue;
          window.exerciseState.dice = [dieValue];
        }

        function adicionarDado(valor) {
          const container = document.getElementById('dice-container');
          if (!window.exerciseState.dice || window.exerciseState.dice.length === 0) {
            container.innerHTML = '';
          }
          const dieValue = Number(valor);
          
          const dieElem = document.createElement('div');
          dieElem.className = 'big-value';
          dieElem.style.fontSize = (window.exerciseState.dieSize || 78) + 'px';
          dieElem.style.color = window.exerciseState.dieColor || '#1f2937';
          dieElem.style.lineHeight = '1';
          dieElem.textContent = '?';
          container.appendChild(dieElem);
          
          const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
          
          const interval = setInterval(() => {
            const randomFace = faces[Math.floor(Math.random() * 6)];
            dieElem.textContent = randomFace;
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
            const face = dieValue >= 1 && dieValue <= 6 ? faces[dieValue - 1] : dieValue;
            dieElem.textContent = face;
            void dieElem.offsetWidth;
            dieElem.classList.add('rolling');
          }, 1000);

          if (!window.exerciseState.dice) window.exerciseState.dice = [];
          window.exerciseState.dice.push(dieValue);
        }
        
        function mudarCorDado(cor) {
          const container = document.getElementById('dice-container');
          Array.from(container.children).forEach(child => child.style.color = String(cor));
          window.exerciseState.dieColor = String(cor);
        }
        
        function mudarTamanhoDado(tamanho) {
          const size = Number(tamanho);
          const container = document.getElementById('dice-container');
          Array.from(container.children).forEach(child => child.style.fontSize = size + 'px');
          window.exerciseState.dieSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor do dado',
          type: 'color',
          defaultValue: '#0077b6',
          pattern: 'mudarCorDado\\("([^"]+)"\\);?',
          template: (value) => `mudarCorDado("${value}");`,
        },
        {
          label: 'Tamanho do dado',
          type: 'range',
          min: 42,
          max: 108,
          step: 2,
          defaultValue: 78,
          pattern: 'mudarTamanhoDado\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoDado(${value});`,
        },
      ],
      validate: (code, state) => /numeroAleatorio\s*\(\s*1\s*,\s*6\s*\)/.test(code) &&
        ((state.die >= 1 && state.die <= 6) || (state.dice && state.dice.length > 0 && state.dice.every(d => d >= 1 && d <= 6))),
    },
    {
      id: 'booleanos',
      animation: '<div class="cax"><div class="lbl">podeAvancar</div><div class="big cax-a">true → 🟢 verde</div><div class="big cax-b">false → 🔴 vermelho</div></div>',
      advanced: [
        'Um booleano só tem dois valores: [true] ou [false]. Condições como [idade >= 18] produzem um booleano, e o [if] usa-o para escolher o caminho. O [else] cobre todos os casos em que a condição foi [false].',
      ],
      title: 'Semáforo lógico',
      points: 15,
      explanation: [
        'Um booleano é um valor que só pode ser verdadeiro ou falso. Pode parecer pouco, mas é uma ideia muito poderosa: portas abertas ou fechadas, jogo terminado ou não, resposta correta ou errada.',
        'Com booleanos usamos decisões. A palavra [if] significa “se”. Se a condição for verdadeira, executa um bloco; caso contrário, podemos usar [else] para executar outro.',
        'Neste exercício, a variável [podeAvancar] controla o semáforo. Se for verdadeira, ligamos o verde. Se for falsa, ligamos o vermelho.',
      ],
      instructions: [
        'A variável [podeAvancar] (do tipo boolean) já está criada no editor — só precisas de mudar o seu valor entre [true] e [false].',
        'Usa [if] e [else].',
        'Liga verde com `ligarSemaforo("verde")` quando [podeAvancar] for [true]; caso contrário liga vermelho com `ligarSemaforo("vermelho")`.',
        'Ajusta o tamanho das luzes e observa a chamada de função que aparece no código.',
      ],
      observation: 'Muda [true] para [false] e executa outra vez para veres o outro ramo do [if].',
      hint: 'Começa por criar a variável booleana. Depois usa [if] para o caso verdadeiro e [else] para o caso falso.',
      starter: 'const podeAvancar: boolean = true;\n\n// escreve a decisão aqui\n\nmudarTamanhoLuzes(88);',
      solution: 'const podeAvancar: boolean = true;\n\nif (podeAvancar) {\n  ligarSemaforo("verde");\n} else {\n  ligarSemaforo("vermelho");\n}\n\nmudarTamanhoLuzes(88);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Semáforo</h2>
            <div class="traffic">
              <div id="red" class="light red"></div>
              <div id="yellow" class="light yellow"></div>
              <div id="green" class="light green"></div>
            </div>
          </section>
        </main>
      `,
      api: `
        function ligarSemaforo(cor) {
          document.querySelectorAll('.light').forEach((light) => light.classList.remove('on'));
          const normalized = String(cor).toLowerCase();
          const map = { vermelho: 'red', amarelo: 'yellow', verde: 'green' };
          const target = document.getElementById(map[normalized]);
          if (target) target.classList.add('on');
          window.exerciseState.color = normalized;
        }
        function mudarTamanhoLuzes(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('.light').forEach((light) => light.style.width = size + 'px');
          window.exerciseState.lightSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Tamanho das luzes',
          type: 'range',
          min: 48,
          max: 116,
          step: 4,
          defaultValue: 88,
          pattern: 'mudarTamanhoLuzes\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoLuzes(${value});`,
        },
      ],
      validate: (code, state) => /:\s*boolean/.test(code) && /\bif\s*\(/.test(code) && ['verde', 'vermelho'].includes(state.color),
    },
    {
      id: 'par-impar',
      animation: '<div class="cax"><div class="big cax-a">6 % 2 = 0 → <span class="ok">PAR</span></div><div class="big cax-b">7 % 2 = 1 → <span class="warn">ÍMPAR</span></div></div>',
      advanced: [
        'O operador [%] (resto) dá o que sobra de uma divisão inteira. Como qualquer número par tem resto 0 ao dividir por 2, [numero % 2 === 0] é a forma habitual de testar paridade — e a mesma ideia serve para contar de N em N.',
      ],
      title: 'Par ou ímpar',
      points: 15,
      explanation: [
        'Vamos escrever agora um programa para descobrir se um número é par ou impar.',
        'Um número par é um número que pode ser dividido por 2 sem deixar resto. Por exemplo, 6 dividido por 2 é igual a 3, com resto 0. ',
        'Já um número ímpar deixa resto quando é dividido por 2; 7 dividido por 2 é igual a 3, com resto 1 (7 = 3 * 2 + 1). ',
        'Em TypeScript usamos o operador [%] para descobrir o resto de uma divisão ([6 % 2] é 0, [7 % 2] é 1). ',
      ],
      instructions: [
        'Cria uma variável [numero] do tipo [number].',
        'Usa [if] e [else].',
        'Se [numero % 2 === 0], chama [mostrarTipo("par")].',
        'Caso contrário, chama [mostrarTipo("ímpar")].',
      ],
      observation: 'Experimenta mudar o número para veres o painel alternar entre par e ímpar.',
      hint: 'O operador % dá o resto da divisão. Se o resto de dividir por 2 for zero, o número é par.',
      starter: 'const numero: number = 7;\n\n// escreve o if aqui',
      solution: 'const numero: number = 7;\n\nif (numero % 2 === 0) {\n  mostrarTipo("par");\n} else {\n  mostrarTipo("ímpar");\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Par ou ímpar?</h2>
            <div class="big-value" id="kind">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrarTipo(tipo) {
          const value = String(tipo).toLowerCase();
          setText('kind', value);
          window.exerciseState.kind = value;
        }
      `,
      validate: (code, state) => /\bif\s*\(/.test(code) && /%\s*2/.test(code) && ['par', 'ímpar', 'impar'].includes(state.kind),
    },
    {
      id: 'semaforo-amarelo',
      animation: '<div class="cax"><div class="lbl">estado = "atenção"</div><div class="big">🔴 <span class="cax-pulse">🟡</span> 🟢</div><div class="lbl">if / else if / else escolhe a luz</div></div>',
      advanced: [
        'Com [if] / [else if] / [else], as condições são testadas por ordem e só corre o primeiro ramo verdadeiro. Por isso a ordem importa: se duas condições pudessem ser verdadeiras, ganha a que aparece primeiro.',
      ],
      title: 'Semáforo com amarelo',
      points: 20,
      explanation: [
        'No exercício anterior havia duas decisões: avançar ou parar. Agora vamos ter três estados: verde, amarelo e vermelho.',
        'Quando há mais de duas possibilidades, podemos usar [if], [else if] e [else]. O [else if] significa “se a primeira condição não aconteceu, testa esta outra”.',
        'Este padrão aparece muito em jogos e aplicações: por exemplo, vida alta, vida média ou vida baixa; nota boa, suficiente ou insuficiente; semáforo verde, amarelo ou vermelho.',
      ],
      instructions: [
        'Cria uma variável [estado] com o texto "atenção".',
        'Se [estado] for "avançar", liga verde.',
        'Se [estado] for "atenção", liga amarelo.',
        'Caso contrário, liga vermelho.',
        'Experimenta mudar o tamanho das luzes [mudarTamanhoLuzes(88)] depois da decisão.',
      ],
      observation: 'O amarelo deve acender quando [estado] for "atenção".',
      hint: 'Usa três ramos: [if] para avançar, [else if] para atenção, e [else] para todos os outros casos.',
      starter: 'const estado: string = "atenção";\n\n// escreve a decisão com [if], [else if] e [else]\n\nmudarTamanhoLuzes(88);',
      solution: 'const estado: string = "atenção";\n\nif (estado === "avançar") {\n  ligarSemaforo("verde");\n} else if (estado === "atenção") {\n  ligarSemaforo("amarelo");\n} else {\n  ligarSemaforo("vermelho");\n}\n\nmudarTamanhoLuzes(88);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Semáforo completo</h2>
            <div class="traffic">
              <div id="red" class="light red"></div>
              <div id="yellow" class="light yellow"></div>
              <div id="green" class="light green"></div>
            </div>
          </section>
        </main>
      `,
      api: `
        function ligarSemaforo(cor) {
          document.querySelectorAll('.light').forEach((light) => light.classList.remove('on'));
          const normalized = String(cor).toLowerCase();
          const map = { vermelho: 'red', amarelo: 'yellow', verde: 'green' };
          const target = document.getElementById(map[normalized]);
          if (target) target.classList.add('on');
          window.exerciseState.color = normalized;
        }
        function mudarTamanhoLuzes(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('.light').forEach((light) => light.style.width = size + 'px');
          window.exerciseState.lightSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Tamanho das luzes',
          type: 'range',
          min: 48,
          max: 116,
          step: 4,
          defaultValue: 88,
          pattern: 'mudarTamanhoLuzes\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoLuzes(${value});`,
        },
      ],
      validate: (code, state) => /else\s+if/.test(code) && /estado\s*===/.test(code) && state.color === 'amarelo',
    },
    {
      id: 'while',
      animation: '<div class="cax"><div class="lbl">while (resposta !== "sim")</div><div class="big"><span class="cax-pop">não</span> <span class="cax-pop d1">não</span> <span class="cax-pop d2 ok">sim ✓</span></div></div>',
      advanced: [
        'Um [while] repete enquanto a condição for verdadeira: pode nunca correr (se já for falsa à entrada) ou correr para sempre (se nunca se tornar falsa). Garantir que algo dentro do ciclo muda a condição evita ciclos infinitos.',
      ],
      title: 'Perguntar até acertar',
      points: 25,
      terminal: true,
      explanation: [
        'Um ciclo [for] é ótimo quando sabemos quantas vezes queremos repetir. Mas há situações em que não sabemos. Queremos continuar até acontecer alguma coisa.',
        'Para isso usamos [while]. Lê-se “enquanto”. Enquanto a condição for verdadeira, o bloco repete. Quando a condição deixa de ser verdadeira, o ciclo termina.',
        'Neste exercício, o programa pergunta no terminal se a pessoa está pronta. Enquanto a resposta não for "sim", deve continuar a perguntar.',
      ],
      instructions: [
        'Usa um ciclo [while].',
        'Dentro do ciclo, usa [await lerInput("...")] para pedir uma resposta no terminal.',
        'Continua a perguntar enquanto a resposta for diferente de "sim".',
        'Depois chama [concluir()].',
      ],
      observation: 'Escreve respostas diferentes de "sim" no terminal. O programa só termina quando escreveres exatamente "sim".',
      hint: 'A variável [resposta] começa vazia. Dentro do [while], atualiza [resposta] com [await lerInput(...)]. Fora do ciclo, [conclui]. O contrário de == é !==.',
      starter: 'let resposta: string = "";\n\n// escreve o while aqui\n\n// quando terminar, chama concluir',
      solution: 'let resposta: string = "";\n\nwhile (resposta !== "sim") {\n  resposta = await lerInput("Estás pronto? Escreve sim para continuar.");\n}\n\nconcluir();',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Estás pronto?</h2>
            <ul class="grid-list" id="answers"></ul>
            <p id="done">Ainda não.</p>
          </section>
        </main>
      `,
      api: `
        window.exerciseState.questions = 0;
        const _origLerInputWhile = lerInput;
        lerInput = async function(mensagem) {
          const answer = await _origLerInputWhile(mensagem);
          window.exerciseState.questions++;
          const li = document.createElement('li');
          li.textContent = answer;
          document.getElementById('answers').appendChild(li);
          return answer;
        };
        function concluir() {
          setText('done', 'Pronto para avançar.');
          window.exerciseState.done = true;
        }
      `,
      validate: (code, state) => /\bwhile\s*\(/.test(code) && /lerInput/.test(code) && state.done === true && state.questions >= 1,
    },
  ],
});
