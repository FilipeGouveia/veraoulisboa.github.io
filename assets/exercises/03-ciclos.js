window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'ciclos',
  title: 'Listas, Aleatoriedade e Ciclos',
  exercises: [
    {
      id: 'listas',
      title: 'Galeria de frutas',
      points: 15,
      explanation: [
        'Uma lista guarda vários valores no mesmo sítio. Em vez de ter fruta1, fruta2 e fruta3, podemos ter uma única variável chamada frutas que contém todos esses textos.',
        'Um ciclo for serve para repetir uma ação. Quando escrevemos for (const fruta of frutas), estamos a dizer: para cada fruta que existir na lista, faz o bloco de código entre chavetas.',
        'Esta combinação, lista + ciclo, é uma das ferramentas mais importantes da programação. Permite fazer a mesma coisa a muitos valores sem copiar e colar linhas de código.',
      ],
      instructions: [
        'Cria uma lista com pelo menos 3 frutas.',
        'Usa um ciclo for.',
        'Dentro do ciclo, chama adicionarFruta(fruta).',
      ],
      observation: 'Cada elemento da lista deve aparecer como uma etiqueta no painel.',
      hint: 'Cria a lista primeiro. Depois usa um ciclo for...of para passar por cada fruta e chama adicionarFruta dentro do ciclo.',
      starter: 'const frutas: string[] = [];\n\n// cria o ciclo aqui',
      solution: 'const frutas: string[] = ["maçã", "banana", "kiwi"];\n\nfor (const fruta of frutas) {\n  adicionarFruta(fruta);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Frutas</h1>
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
      `,
      validate: (code, state) => /\bfor\s*\(/.test(code) && (state.fruits || []).length >= 3,
    },
    {
      id: 'aleatorio',
      title: 'Lançar o dado',
      points: 10,
      explanation: [
        'Às vezes queremos que o programa não faça sempre a mesma coisa. Jogos, simulações e sorteios usam números aleatórios para criar variedade.',
        'Neste exercício, a função numeroAleatorio(1, 6) devolve um número entre 1 e 6, como se estivesses a lançar um dado.',
        'Guarda esse valor numa variável e depois mostra-o. Assim separas o momento de gerar o número do momento de o apresentar.',
      ],
      instructions: [
        'Usa numeroAleatorio(1, 6) para gerar o valor do dado.',
        'Guarda esse valor numa variável do tipo number.',
        'Mostra esse valor com mostrarDado.',
      ],
      observation: 'Se executares várias vezes, o número pode mudar. Isso é esperado.',
      hint: 'Usa numeroAleatorio com mínimo 1 e máximo 6. Guarda o resultado numa variável antes de o mostrar.',
      starter: '// cria a variável dado aqui\n// depois mostra o valor',
      solution: 'const dado: number = numeroAleatorio(1, 6);\nmostrarDado(dado);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Dado</h1>
            <div class="big-value" id="die">?</div>
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
          const die = Number(valor);
          setText('die', die);
          window.exerciseState.die = die;
        }
      `,
      validate: (code, state) => /numeroAleatorio\s*\(\s*1\s*,\s*6\s*\)/.test(code) && state.die >= 1 && state.die <= 6,
    },
    {
      id: 'booleanos',
      title: 'Semáforo lógico',
      points: 15,
      explanation: [
        'Um booleano é um valor que só pode ser verdadeiro ou falso. Pode parecer pouco, mas é uma ideia muito poderosa: portas abertas ou fechadas, jogo terminado ou não, resposta correta ou errada.',
        'Com booleanos usamos decisões. A palavra if significa “se”. Se a condição for verdadeira, executa um bloco; caso contrário, podemos usar else para executar outro.',
        'Neste exercício, a variável podeAvancar controla o semáforo. Se for verdadeira, ligamos o verde. Se for falsa, ligamos o vermelho.',
      ],
      instructions: [
        'Cria uma variável podeAvancar do tipo boolean.',
        'Usa if e else.',
        'Liga verde quando podeAvancar for true; caso contrário liga vermelho.',
      ],
      observation: 'Muda true para false e executa outra vez para veres o outro ramo do if.',
      hint: 'Começa por criar a variável booleana. Depois usa if para o caso verdadeiro e else para o caso falso.',
      starter: 'const podeAvancar: boolean = true;\n\n// escreve a decisão aqui',
      solution: 'const podeAvancar: boolean = true;\n\nif (podeAvancar) {\n  ligarSemaforo("verde");\n} else {\n  ligarSemaforo("vermelho");\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Semáforo</h1>
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
      `,
      validate: (code, state) => /:\s*boolean/.test(code) && /\bif\s*\(/.test(code) && ['verde', 'vermelho'].includes(state.color),
    },
    {
      id: 'par-impar',
      title: 'Par ou ímpar',
      points: 15,
      explanation: [
        'Um número par é um número que pode ser dividido por 2 sem sobrar nada. 2, 4, 6 e 8 são exemplos de números pares.',
        'Um número ímpar deixa resto quando é dividido por 2. 1, 3, 5 e 7 são exemplos de números ímpares.',
        'Em TypeScript usamos o operador % para descobrir o resto de uma divisão. Se numero % 2 for igual a 0, então o número é par. Caso contrário, é ímpar.',
      ],
      instructions: [
        'Cria uma variável numero do tipo number.',
        'Usa if e else.',
        'Se numero % 2 === 0, chama mostrarTipo("par").',
        'Caso contrário, chama mostrarTipo("ímpar").',
      ],
      observation: 'Experimenta mudar o número para veres o painel alternar entre par e ímpar.',
      hint: 'O operador % dá o resto da divisão. Se o resto de dividir por 2 for zero, o número é par.',
      starter: 'const numero: number = 7;\n\n// escreve o if aqui',
      solution: 'const numero: number = 7;\n\nif (numero % 2 === 0) {\n  mostrarTipo("par");\n} else {\n  mostrarTipo("ímpar");\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Par ou ímpar?</h1>
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
      title: 'Semáforo com amarelo',
      points: 15,
      explanation: [
        'No exercício anterior havia duas decisões: avançar ou parar. Agora vamos ter três estados: verde, amarelo e vermelho.',
        'Quando há mais de duas possibilidades, podemos usar if, else if e else. O else if significa “se a primeira condição não aconteceu, testa esta outra”.',
        'Este padrão aparece muito em jogos e aplicações: por exemplo, vida alta, vida média ou vida baixa; nota boa, suficiente ou insuficiente; semáforo verde, amarelo ou vermelho.',
      ],
      instructions: [
        'Cria uma variável estado com o texto "atenção".',
        'Se estado for "avançar", liga verde.',
        'Se estado for "atenção", liga amarelo.',
        'Caso contrário, liga vermelho.',
      ],
      observation: 'O amarelo deve acender quando estado for "atenção".',
      hint: 'Usa três ramos: if para avançar, else if para atenção, e else para todos os outros casos.',
      starter: 'const estado: string = "atenção";\n\n// escreve a decisão com if, else if e else',
      solution: 'const estado: string = "atenção";\n\nif (estado === "avançar") {\n  ligarSemaforo("verde");\n} else if (estado === "atenção") {\n  ligarSemaforo("amarelo");\n} else {\n  ligarSemaforo("vermelho");\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Semáforo completo</h1>
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
      `,
      validate: (code, state) => /else\s+if/.test(code) && state.color === 'amarelo',
    },
    {
      id: 'while',
      title: 'Perguntar até acertar',
      points: 15,
      explanation: [
        'Um ciclo for é ótimo quando sabemos quantas vezes queremos repetir. Mas há situações em que não sabemos. Queremos continuar até acontecer alguma coisa.',
        'Para isso usamos while. Lê-se “enquanto”. Enquanto a condição for verdadeira, o bloco repete. Quando a condição deixa de ser verdadeira, o ciclo termina.',
        'Neste exercício, a função perguntar devolve primeiro "nao", depois "talvez" e só depois "sim". O teu programa deve continuar até chegar ao "sim".',
      ],
      instructions: [
        'Usa um ciclo while.',
        'Chama perguntar() até receberes "sim".',
        'Depois chama concluir().',
      ],
      observation: 'Deves ver três respostas aparecerem antes da mensagem final.',
      hint: 'A variável resposta começa vazia. Dentro do while, atualiza resposta chamando perguntar(). Fora do ciclo, conclui.',
      starter: 'let resposta: string = "";\n\n// escreve o while aqui\n\n// quando terminar, chama concluir',
      solution: 'let resposta: string = "";\n\nwhile (resposta !== "sim") {\n  resposta = perguntar();\n}\n\nconcluir();',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Estás pronto?</h1>
            <ul class="grid-list" id="answers"></ul>
            <p id="done">Ainda não.</p>
          </section>
        </main>
      `,
      api: `
        const answers = ['nao', 'talvez', 'sim'];
        let answerIndex = 0;
        window.exerciseState.questions = 0;
        function perguntar() {
          const answer = answers[Math.min(answerIndex, answers.length - 1)];
          answerIndex++;
          window.exerciseState.questions++;
          const li = document.createElement('li');
          li.textContent = answer;
          document.getElementById('answers').appendChild(li);
          return answer;
        }
        function concluir() {
          setText('done', 'Pronto para avançar.');
          window.exerciseState.done = true;
        }
      `,
      validate: (code, state) => /\bwhile\s*\(/.test(code) && state.done === true && state.questions >= 3,
    },
  ],
});
