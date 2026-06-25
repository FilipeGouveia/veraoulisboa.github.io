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
      id: 'anatomia-codigo',
      title: 'Anatomia de um Programa',
      points: 5,
      animation: `<div class="cax"><style>.an-wrap{display:flex;flex-direction:column;gap:5px;width:100%}.an-row{display:flex;align-items:flex-start;gap:8px;padding:5px 8px;border-radius:6px;background:#f1f5f9;border-left:3px solid #e2e8f0}.an-kw{font-family:"Fira Code","Courier New",monospace;font-size:12px;font-weight:700;min-width:72px;flex-shrink:0}.an-desc{font-size:10px;color:#64748b;line-height:1.35}.an-c0{border-color:#8b949e}.an-c0 .an-kw{color:#6b7280}.an-c1{border-color:#ef4444}.an-c1 .an-kw{color:#dc2626}.an-c2{border-color:#7c3aed}.an-c2 .an-kw{color:#7c3aed}.an-c3{border-color:#f59e0b}.an-c3 .an-kw{color:#b45309}.an-c4{border-color:#3b82f6}.an-c4 .an-kw{color:#1d4ed8}.an-c5{border-color:#0ea5e9}.an-c5 .an-kw{color:#0369a1}.an-c6{border-color:#d97706}.an-c6 .an-kw{color:#92400e}</style><div class="an-wrap"><div class="an-row an-c0"><span class="an-kw">// ...</span><span class="an-desc">Comentário — ignorado pelo computador</span></div><div class="an-row an-c1"><span class="an-kw">function</span><span class="an-desc">Declara uma função reutilizável</span></div><div class="an-row an-c3"><span class="an-kw">parâmetro</span><span class="an-desc">Variável que recebe o valor passado</span></div><div class="an-row an-c4"><span class="an-kw">: tipo</span><span class="an-desc">Anotação do tipo de dado esperado</span></div><div class="an-row an-c1"><span class="an-kw">if / for</span><span class="an-desc">Condicional e ciclo de repetição</span></div><div class="an-row an-c5"><span class="an-kw">"texto"</span><span class="an-desc">String — literal de texto entre aspas</span></div><div class="an-row an-c1"><span class="an-kw">return</span><span class="an-desc">Devolve um valor da função</span></div><div class="an-row an-c1"><span class="an-kw">const / let</span><span class="an-desc">Declara uma variável (fixa ou mutável)</span></div><div class="an-row an-c2"><span class="an-kw">fn(arg)</span><span class="an-desc">Chamada de função com um argumento</span></div></div></div>`,
      explanation: [
        'Um programa é composto por partes bem definidas, e cada uma tem um nome. Perceber esses nomes ajuda-te a ler documentação, a pedir ajuda e a entender mensagens de erro.',
        'Neste exercício podes explorar um programa de exemplo e descobrir o que cada parte significa. Passa o rato por qualquer parte colorida para ver o nome e a descrição.',
        'Podes voltar a este exercício sempre que quiseres rever um conceito ou esclarecer o nome de alguma parte do código.',
      ],
      instructions: [
        'Passa o rato pelo código no painel da direita.',
        'Explora pelo menos as partes coloridas: função, parâmetro, tipo, if, return, string, for, const, chamada de função.',
        'Quando terminares de explorar, clica em Executar.',
      ],
      observation: 'O terminal mostra o resultado do programa de exemplo. Depois de Executar, o exercício fica concluído.',
      hint: 'Não há nada para escrever — o código já está escrito. Basta passar o rato pelas partes coloridas e ler as descrições.',
      advanced: [
        'Estes conceitos existem em praticamente todas as linguagens de programação, com nomes ligeiramente diferentes. Em Python, por exemplo, não há anotações de tipo obrigatórias e usa-se [def] em vez de [function]. Mas parâmetros, argumentos, return e if existem da mesma forma.',
      ],
      starter: '// Passa o rato pelo código no painel à direita.\n// Clica em Executar quando terminares de explorar.',
      solution: '// Passa o rato pelo código no painel à direita.\n// Clica em Executar quando terminares de explorar.',
      html: `
        <style>
          body{background:#0d1117}
          .ca{padding:20px 16px;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
          .ca-lbl{font-size:11px;font-weight:700;color:#8b949e;letter-spacing:.07em;text-transform:uppercase;text-align:center;font-family:Inter,Arial,sans-serif}
          .ca-pre{margin:0;width:100%;max-width:540px;background:#161b22;border:1px solid #30363d;border-radius:10px;padding:18px 22px;overflow-x:auto}
          .ca-code{font-family:"Fira Code","Courier New",monospace;font-size:13px;line-height:2.1;color:#c9d1d9;display:block}
          .tk{border-radius:3px;padding:0 2px}
          .tk[data-l]{cursor:pointer;transition:background .1s}
          .tk[data-l]:hover{background:rgba(255,255,255,.16)}
          .tk-kw{color:#ff7b72}
          .tk-fn{color:#d2a8ff}
          .tk-par{color:#ffa657}
          .tk-tp{color:#79c0ff}
          .tk-st{color:#a5d6ff}
          .tk-nm{color:#79c0ff}
          .tk-cm{color:#8b949e;font-style:italic}
          .tk-vr{color:#e3b341}
          .ca-tt{position:fixed;max-width:265px;background:#1e293b;color:#f1f5f9;border:1px solid #334155;border-radius:8px;padding:10px 13px;font-family:Inter,Arial,sans-serif;font-size:12.5px;line-height:1.55;pointer-events:none;opacity:0;z-index:99;box-shadow:0 6px 20px rgba(0,0,0,.5);transition:opacity .1s}
          .ca-tt.vis{opacity:1}
          .ca-tt-l{font-weight:800;font-size:13px;color:#93c5fd;margin-bottom:3px}
        </style>
        <div class="ca">
          <div class="ca-lbl">Passa o rato por cada parte colorida</div>
          <pre class="ca-pre"><code class="ca-code"><span class="tk tk-cm" data-l="Comentário" data-d="Texto ignorado pelo computador. Serve para explicar o código a quem o lê.">//  Conta de 1 até 5 e classifica cada número</span>
<span class="tk tk-kw" data-l="Palavra-chave function" data-d="Palavra reservada da linguagem que indica o início de uma função.">function</span> <span class="tk tk-fn" data-l="Nome da função" data-d="Identificador pelo qual esta função é chamada. O nome é escolhido pelo programador.">descrever</span>(<span class="tk tk-par" data-l="Parâmetro" data-d="Variável local que recebe o valor passado na chamada. Aqui chama-se n.">n</span><span class="tk tk-tp" data-l="Tipo do parâmetro" data-d="Indica que n deve ser um número. Em TypeScript escreve-se após dois pontos.">: number</span>)<span class="tk tk-tp" data-l="Tipo de retorno" data-d="Tipo do valor que a função devolve. Aqui devolve texto (string).">: string</span> {
  <span class="tk tk-kw" data-l="Condicional if" data-d="Executa o bloco seguinte apenas quando a condição entre parênteses é verdadeira.">if</span> (<span class="tk tk-par" data-l="Expressão / Condição" data-d="Verifica se o resto de dividir n por 2 é zero — ou seja, se n é par.">n % 2 === 0</span>) {
    <span class="tk tk-kw" data-l="Instrução de retorno (return)" data-d="Termina a execução da função e envia o valor para quem a chamou.">return</span> <span class="tk tk-st" data-l="String — literal de texto" data-d="Texto literal delimitado por aspas. Qualquer texto entre aspas é uma string.">"par"</span>;
  }
  <span class="tk tk-kw" data-l="Instrução de retorno (return)" data-d="Termina a execução da função e envia o valor para quem a chamou.">return</span> <span class="tk tk-st" data-l="String — literal de texto" data-d="Outro literal de texto. O valor que a função devolve quando n não é par.">"ímpar"</span>;
}

<span class="tk tk-kw" data-l="Ciclo for" data-d="Repete o bloco de código um número específico de vezes, controlado pelo contador.">for</span> (<span class="tk tk-kw" data-l="Palavra-chave let" data-d="Cria uma variável que pode mudar de valor. Usada aqui para o contador do ciclo.">let</span> <span class="tk tk-vr" data-l="Variável contadora do ciclo" data-d="O contador do ciclo. Começa em 1, aumenta 1 em cada repetição, e o ciclo continua enquanto for menor ou igual a 5.">i</span> = <span class="tk tk-nm" data-l="Inteiro — número inteiro" data-d="Valor numérico sem parte decimal. Aqui é o valor inicial do contador i.">1</span>; i &lt;= 5; i++) {
  <span class="tk tk-kw" data-l="Palavra-chave const" data-d="Cria uma variável cujo valor não pode ser alterado depois de definido.">const</span> <span class="tk tk-vr" data-l="Nome da variável" data-d="Etiqueta que identifica o valor guardado. Aqui guarda o resultado de descrever(i).">texto</span><span class="tk tk-tp" data-l="Anotação de tipo da variável" data-d="Indica que texto guarda uma string — texto.">: string</span> = <span class="tk tk-fn" data-l="Chamada de função" data-d="Executa descrever passando i como argumento. O valor devolvido é guardado em texto.">descrever</span>(<span class="tk tk-nm" data-l="Argumento (variável)" data-d="O valor atual de i é passado à função descrever, que o recebe no parâmetro n.">i</span>);
  <span class="tk tk-fn" data-l="Chamada de função escrever" data-d="Envia o texto construído para o terminal. O operador + une o número e a palavra.">escrever</span>(i + <span class="tk tk-st" data-l="String — literal de texto" data-d="Texto de ligação. O operador + concatena (une) valores numa só frase.">" é "</span> + texto);
}</code></pre>
          <div class="ca-lbl" style="opacity:.6;font-size:10px;margin-top:2px">Podes voltar aqui sempre que quiseres rever estes conceitos</div>
        </div>
        <div class="ca-tt" id="ca-tt"><div class="ca-tt-l" id="ca-tt-l"></div><div id="ca-tt-d"></div></div>
      `,
      api: `
        (function() {
          var tt = document.getElementById('ca-tt');
          var ttL = document.getElementById('ca-tt-l');
          var ttD = document.getElementById('ca-tt-d');
          document.querySelectorAll('[data-l]').forEach(function(el) {
            el.addEventListener('mouseenter', function() {
              ttL.textContent = el.getAttribute('data-l');
              ttD.textContent = el.getAttribute('data-d');
              tt.classList.add('vis');
            });
            el.addEventListener('mousemove', function(e) {
              var x = e.clientX + 14;
              var y = e.clientY + 14;
              if (x + 280 > window.innerWidth) x = e.clientX - 294;
              if (y + 120 > window.innerHeight) y = e.clientY - 134;
              tt.style.left = x + 'px';
              tt.style.top = y + 'px';
            });
            el.addEventListener('mouseleave', function() {
              tt.classList.remove('vis');
            });
          });
          window.exerciseState.viewed = true;
        })();
      `,
      validate: () => true,
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
