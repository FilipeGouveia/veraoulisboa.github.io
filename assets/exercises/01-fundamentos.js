window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'fundamentos',
  title: 'Primeiros Programas e Texto',
  exercises: [
    {
      id: 'intro',
      advanced: [
        'Tudo o que vês neste painel é construído com HTML (a estrutura), CSS (o aspeto) e JavaScript/TypeScript (o comportamento). Neste laboratório só escreves o código; o HTML e o CSS já estão preparados por baixo.',
      ],
      title: 'Bem-vindo ao laboratório de programação!',
      points: 5,
      explanation: [
        'Hoje vão aprender a programar usando uma linguagem chamada TypeScript.',
        'Programar é, basicamente, dar instruções ao computador, como se estivéssemos a ensinar-lhe uma receita, passo a passo. Essas instruções formam programas.',
        'Já usaram programas feitos por outras pessoas: o navegador que estão a usar, jogos, calculadoras, editores de texto... Tudo isso são conjuntos de instruções que alguém escreveu.',
        'Neste laboratório vão aprender os primeiros passos para escreverem os vossos próprios programas. Podem ser úteis para a escola, podem virar jogos engraçados… ou podem simplesmente existir porque sim!',
        'Não precisam de saber nada antes de começar — só precisam de curiosidade e vontade de experimentar!',
        'Preparados? Vamos programar! 👨‍💻👩‍💻'
      ],
      instructions: [
        'Faça modificações ao campo de "Configurações Visuais" e veja o que acontece.'
      ],
      observation: 'Veja se consegue colocar a caixa vermelha e o texto grande ao mesmo tempo!',
      hint: 'Não há dicas 🤖',
      starter: 'mostrar("Mude as coisas no menu ao lado para perceber o que acontece!");\nmudarCorPainel("#3b93ff");\nmudarTamanhoMensagem(44);',
      solution: 'mostrar("Consegui mudar a cor e o tamanho!");\nmudarCorPainel("#e23d3d");\nmudarTamanhoMensagem(60);',
      html: `
       <main class="stage">
          <section class="panel dark">
            <h2 id="message">Este painel muda quando o teu programa corre.</h2>
          </section>
        </main>
      `,
      api: `
        function mostrar(texto) {
          const message = String(texto);
          setText('message', message);
          window.exerciseState.message = message;
        }
        function mudarCorPainel(cor) {
          document.querySelector('.panel').style.background = String(cor);
          window.exerciseState.panelColor = String(cor);
        }
        function mudarTamanhoMensagem(tamanho) {
          const size = Number(tamanho);
          document.getElementById('message').style.fontSize = size + 'px';
          window.exerciseState.messageSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor do painel',
          type: 'color',
          defaultValue: '#102033',
          pattern: 'mudarCorPainel\\("([^"]+)"\\);?',
          template: (value) => `mudarCorPainel("${value}");`,
        },
        {
          label: 'Tamanho da mensagem',
          type: 'range',
          min: 28,
          max: 72,
          step: 2,
          defaultValue: 44,
          pattern: 'mudarTamanhoMensagem\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoMensagem(${value});`,
        },
      ],
      validate: (code, state) => state.message && state.message.length >= 8 &&
        (state.panelColor !== '#3b93ff' || state.messageSize !== 44),
    },
    {
      id: 'ola',
      animation: '<div class="anat"><style>.anat{font-family:Inter,system-ui,sans-serif;text-align:center}.anat .loc{font-size:26px;font-weight:800;margin-bottom:10px}.anat .tok{padding:1px 5px;border-radius:5px}.anat .fn{animation:anFn 6s infinite}.anat .arg{animation:anArg 6s infinite}.anat .semi{animation:anSemi 6s infinite}@keyframes anFn{0%,27%{background:#fde68a}33%,100%{background:transparent}}@keyframes anArg{0%,33%{background:transparent}39%,60%{background:#bbf7d0}66%,100%{background:transparent}}@keyframes anSemi{0%,66%{background:transparent}72%,93%{background:#fecaca}100%{background:transparent}}.anat .labels{position:relative;height:1.7em;font-size:14px;font-weight:700}.anat .labels span{position:absolute;left:0;right:0;text-align:center;opacity:0}.anat .lf{color:#b45309;animation:anLf 6s infinite}.anat .la{color:#15803d;animation:anLa 6s infinite}.anat .ls{color:#b91c1c;animation:anLs 6s infinite}@keyframes anLf{0%,27%{opacity:1}33%,100%{opacity:0}}@keyframes anLa{0%,33%{opacity:0}39%,60%{opacity:1}66%,100%{opacity:0}}@keyframes anLs{0%,66%{opacity:0}72%,93%{opacity:1}100%{opacity:0}}</style><div class="loc"><span class="tok fn">mostrar</span>(<span class="tok arg">"Olá!"</span>)<span class="tok semi">;</span></div><div class="labels"><span class="lf">↑ mostrar = a função (a ação)</span><span class="la">↑ "Olá!" = o argumento (a informação)</span><span class="ls">↑ ; = fim da instrução</span></div></div>',
      title: 'Olá, mundo visual',
      points: 10,
      explanation: [
        'Um programa é uma lista de instruções. O computador lê-as pela ordem em que aparecem e executa-as uma a uma. Nesta atividade, a instrução principal é chamar uma função.',
        'Uma função é um comando com nome que executa uma tarefa. Quando escreves [mostrar("Olá, FCUL!")], chamas a função [mostrar]. A informação que pões entre parênteses chama-se argumento — aqui o argumento é o texto ["Olá, FCUL!"]. (Quando falamos do espaço que a função reserva para receber esse valor, chamamos-lhe parâmetro; o valor concreto que lá colocas é o argumento.)',
        'Neste laboratório usamos dois nomes especiais (aliases) para apresentar coisas: [escrever(...)] envia texto para o terminal — é o equivalente ao [print] que existe na maioria das linguagens de programação. [mostrar(...)] coloca o resultado no painel visual; é um pouco mais "mágico", porque o que aparece depende dos elementos gráficos de cada exercício.',
        'Repara que o texto fica entre aspas: em TypeScript, texto chama-se [string]. E no fim da linha há um [;] (ponto e vírgula), que marca o fim de uma instrução.',
      ],
      advanced: [
        'Uma [string] é guardada como uma sequência ordenada de caracteres, e cada caractere tem um código numérico associado. É essa ideia que mais tarde te vai permitir transformar letras em números (e o contrário) nos exercícios das cifras.',
      ],
      instructions: [
        'Chama a função [mostrar] com uma frase tua.',
        'A mensagem tem de ter pelo menos 8 caracteres (letras, números ou caracteres especiais).',
        'Carrega em Executar e confirma que o painel muda.',
        'Usa a exploração visual para mudar a cor do painel e o tamanho da mensagem.',
      ],
      observation: 'Se mudares apenas o texto dentro das aspas e executares outra vez, o resultado também muda.',
      hint: 'Texto fica entre aspas. Escreve uma frase tua dentro da função [mostrar].',
      starter: 'mostrar("");\nmudarCorPainel("#102033");\nmudarTamanhoMensagem(44);',
      solution: 'mostrar("Olá, FCUL!");\nmudarCorPainel("#102033");\nmudarTamanhoMensagem(44);',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2 id="message">...</h2>
            <p>Este painel muda quando o teu programa corre.</p>
          </section>
        </main>
      `,
      api: `
        function mostrar(texto) {
          const message = String(texto);
          setText('message', message);
          window.exerciseState.message = message;
        }
        function mudarCorPainel(cor) {
          document.querySelector('.panel').style.background = String(cor);
          window.exerciseState.panelColor = String(cor);
        }
        function mudarTamanhoMensagem(tamanho) {
          const size = Number(tamanho);
          document.getElementById('message').style.fontSize = size + 'px';
          window.exerciseState.messageSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor do painel',
          type: 'color',
          defaultValue: '#102033',
          pattern: 'mudarCorPainel\\("([^"]+)"\\);?',
          template: (value) => `mudarCorPainel("${value}");`,
        },
        {
          label: 'Tamanho da mensagem',
          type: 'range',
          min: 28,
          max: 72,
          step: 2,
          defaultValue: 44,
          pattern: 'mudarTamanhoMensagem\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoMensagem(${value});`,
        },
      ],
      validate: (code, state) => state.message && state.message.length >= 8,
    },
    {
      id: 'strings',
      animation: '<div class="cax"><div class="lbl">const nome: string = "Ana"</div><div class="big">🏷️ nome → <span class="cax-pulse accent">"Ana"</span></div><div class="lbl">uma caixa com etiqueta guarda o valor</div></div>',
      title: 'Variáveis',
      points: 10,
      explanation: [
        'Uma variável é um nome que damos a um valor. Podes imaginar uma variável como uma caixa com uma etiqueta. A etiqueta é o nome da variável; lá dentro fica guardado o valor.',
        'Neste exercício vais guardar o teu nome numa variável. Depois vais passar essa variável a uma função. Isto é importante porque, em programas maiores, raramente escrevemos tudo diretamente. Guardamos valores, damos-lhes nomes e reutilizamo-los.',
        'Podemos definir as variáveis de várias formas. Em TypeScript, uma forma comum é escrever [const nome: string = "Ana";]. O nome da variável é [nome], o valor que lhe estamos a dar é ["Ana"] e o tipo desse valor é [string].',
        'A linha de código [const nome: string = "";] é uma pista do TypeScript: diz que a variável nome deve guardar texto. Aqui no laboratório o tipo serve sobretudo como documentação — num editor com TypeScript, tentar guardar um número onde se espera texto seria assinalado como erro.',
      ],
      advanced: [
        'O [const] no início significa que a variável não pode ser reatribuída: depois de [const nome: string = "Ana";], não podes escrever [nome = "Carlos";] mais tarde — o valor de [nome] será sempre "Ana".',
        'Se quiseres uma variável que possa mudar, usa [let] em vez de [const]. Por exemplo, [let idade: number = 30;] cria uma variável que guarda um número e que pode ser atualizada depois. Na prática preferimos [const] e só usamos [let] quando precisamos mesmo de mudar o valor.',
      ],
      instructions: [
        'Cria uma variável nome com tipo string.',
        'Cria uma variável detalhe com tipo string.',
        'Usa [criarCartao(nome, detalhe)] para preencher o cartão.',
        'Experimenta mudar a cor do cartão e o tamanho do nome.',
      ],
      observation: 'O cartão deve mostrar o nome e uma frase descritiva. O importante é perceber que a função recebe valores que preparaste antes.',
      hint: 'Observa os exemplos fornecidos para perceber como criar e usar variáveis.',
      starter: 'const nome: string = "";\nconst detalhe: string = "";\ncriarCartao(nome, detalhe);\n\nmudarCorCartao("#ffffff");\nmudarTamanhoNome(48);',
      solution: 'const nome: string = "Ana";\nconst detalhe: string = "gosta de astronomia";\ncriarCartao(nome, detalhe);\n\nmudarCorCartao("#ffffff");\nmudarTamanhoNome(48);',
      html: `
        <main class="stage">
          <section class="panel">
            <p>Cartão</p>
            <h2 id="name">Nome</h2>
            <p id="detail">Detalhe</p>
          </section>
        </main>
      `,
      api: `
        function criarCartao(nome, detalhe) {
          const safeName = String(nome).trim();
          const safeDetail = String(detalhe).trim();
          setText('name', safeName || 'Nome');
          setText('detail', safeDetail || 'Detalhe');
          window.exerciseState.name = safeName;
          window.exerciseState.detail = safeDetail;
        }
        function mudarCorCartao(cor) {
          document.querySelector('.panel').style.background = String(cor);
          window.exerciseState.cardColor = String(cor);
        }
        function mudarTamanhoNome(tamanho) {
          const size = Number(tamanho);
          document.getElementById('name').style.fontSize = size + 'px';
          window.exerciseState.nameSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor do cartão',
          type: 'color',
          defaultValue: '#ffffff',
          pattern: 'mudarCorCartao\\("([^"]+)"\\);?',
          template: (value) => `mudarCorCartao("${value}");`,
        },
        {
          label: 'Tamanho do nome',
          type: 'range',
          min: 30,
          max: 76,
          step: 2,
          defaultValue: 48,
          pattern: 'mudarTamanhoNome\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoNome(${value});`,
        },
      ],
      validate: (code, state) => /:\s*string/.test(code) && state.name?.length >= 2 && state.detail?.length >= 5,
    },
    {
      id: 'const-let',
      title: 'const e let',
      points: 10,
      explanation: [
        'Já usaste o [const]. Uma variável [const] não pode ser reatribuída: depois de receber um valor, ele fica fixo.',
        'Quando precisas de um valor que muda ao longo do programa, usas [let]. Uma variável [let] pode receber novos valores com [=].',
        'Regra prática: usa [const] por defeito e só troca para [let] quando precisares mesmo de mudar o valor.',
      ],
      advanced: [
        'Mudar o valor de uma variável [let] (ex.: [total = total + 5]) chama-se reatribuição. Tentar reatribuir uma [const] dá um erro: "Assignment to constant variable".',
      ],
      animation: '<div class="cax"><div class="lbl">let total</div><div class="big"><span class="cax-pop">0</span> <span class="cax-pop d1">5</span> <span class="cax-pop d2 accent">8</span></div><div class="lbl">com let, o valor pode mudar</div></div>',
      instructions: [
        'Cria uma variável [total] com [let] e o valor inicial [0].',
        'Soma [5] a [total] (ex.: [total = total + 5;]).',
        'Soma mais [3] a [total].',
        'Mostra o resultado com [mostrar(total)].',
      ],
      observation: 'O painel deve mostrar 8 (0 + 5 + 3).',
      hint: 'Com [let] podes reatribuir: [total = total + 5;]. Repete para somar mais 3.',
      starter: '// cria a variável total com let\n\n// soma 5 e depois soma 3\n\n// mostra total com mostrar',
      solution: 'let total: number = 0;\ntotal = total + 5;\ntotal = total + 3;\nmostrar(total);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Total</h2>
            <div class="big-value" id="value">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrar(valor) {
          const v = Number(valor);
          setText('value', Number.isFinite(v) ? v : 'Erro');
          window.exerciseState.value = v;
        }
      `,
      validate: (code, state) => /\blet\b/.test(code) && /total\s*=\s*total\s*\+/.test(code) && state.value === 8,
    },
  ],
});
