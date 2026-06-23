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
      starter: 'mostrarMensagem("Mude as coisas no menu ao lado para perceber o que acontece!");\nmudarCorPainel("#3b93ff");\nmudarTamanhoMensagem(44);',
      solution: 'mostrarMensagem("Consegui mudar a cor e o tamanho!");\nmudarCorPainel("#e23d3d");\nmudarTamanhoMensagem(60);',
      html: `
       <main class="stage">
          <section class="panel dark">
            <h2 id="message">Este painel muda quando o teu programa corre.</h2>
          </section>
        </main>
      `,
      api: `
        function mostrarMensagem(texto) {
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
      animation: '<div class="cax"><div class="lbl">mostrarMensagem("...")</div><div class="big accent cax-step">Olá, FCUL!</div></div>',
      title: 'Olá, mundo visual',
      points: 10,
      explanation: [
        'Um programa é uma lista de instruções. O computador lê essas instruções pela ordem em que aparecem e tenta executá-las uma a uma. Nesta primeira atividade, a instrução principal é chamar uma função.',
        'Uma função é como um comando com nome. Quando escreves [mostrarMensagem("Olá, FCUL!")], estás a pedir ao programa para pegar no texto entre aspas e colocá-lo no painel de resultado.',
        'Repara que o texto fica entre aspas. Em TypeScript, texto chama-se [string]. Sempre que quiseres escrever uma palavra, uma frase ou uma mensagem para aparecer no ecrã, vais quase sempre usar uma [string].',
      ],
      advanced: [
        'Quando escreves [mostrarMensagem("Olá")], acontecem dois passos: o computador encontra a função com o nome [mostrarMensagem] e depois executa as instruções que estão guardadas lá dentro. O texto entre parênteses chama-se argumento — é a informação que entregas à função para ela trabalhar.',
        'Uma [string] é guardada como uma sequência ordenada de caracteres, e cada caractere tem um código numérico associado. É essa ideia que mais tarde te vai permitir transformar letras em números (e o contrário) nos exercícios das cifras.',
      ],
      instructions: [
        'Chama a função [mostrarMensagem] com uma frase tua.',
        'A mensagem tem de ter pelo menos 8 caracteres (letras, números ou caracteres especiais).',
        'Carrega em Executar e confirma que o painel muda.',
        'Usa a exploração visual para mudar a cor do painel e o tamanho da mensagem.',
      ],
      observation: 'Se mudares apenas o texto dentro das aspas e executares outra vez, o resultado também muda.',
      hint: 'Texto fica entre aspas. Escreve uma frase tua dentro da função [mostrarMensagem].',
      starter: 'mostrarMensagem("");\nmudarCorPainel("#102033");\nmudarTamanhoMensagem(44);',
      solution: 'mostrarMensagem("Olá, FCUL!");\nmudarCorPainel("#102033");\nmudarTamanhoMensagem(44);',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2 id="message">...</h2>
            <p>Este painel muda quando o teu programa corre.</p>
          </section>
        </main>
      `,
      api: `
        function mostrarMensagem(texto) {
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
      starter: '//cria a variável nome aqui\n//cria a variável detalhe aqui;\ncriarCartao(nome, detalhe);\n\nmudarCorCartao("#ffffff");\nmudarTamanhoNome(48);',
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
  ],
});
