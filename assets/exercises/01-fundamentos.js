window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'fundamentos',
  title: 'Primeiros Programas e Texto',
  exercises: [
    {
      id: 'ola',
      title: 'Olá, mundo visual',
      points: 10,
      explanation: [
        'Um programa é uma lista de instruções. O computador lê essas instruções pela ordem em que aparecem e tenta executá-las uma a uma. Nesta primeira atividade, a instrução principal é chamar uma função.',
        'Uma função é como um comando com nome. Quando escreves mostrarMensagem("Olá, FCUL!"), estás a pedir ao programa para pegar no texto entre aspas e colocá-lo no painel de resultado.',
        'Repara que o texto fica entre aspas. Em TypeScript, texto chama-se string. Sempre que quiseres escrever uma palavra, uma frase ou uma mensagem para aparecer no ecrã, vais quase sempre usar uma string.',
      ],
      instructions: [
        'Chama a função mostrarMensagem com uma frase tua.',
        'A mensagem tem de ter pelo menos 8 caracteres.',
        'Carrega em Executar e confirma que o painel muda.',
      ],
      observation: 'Se mudares apenas o texto dentro das aspas e executares outra vez, o resultado também muda.',
      hint: 'Texto fica entre aspas. Escreve uma frase tua dentro da função mostrarMensagem.',
      starter: 'mostrarMensagem("");',
      solution: 'mostrarMensagem("Olá, FCUL!");',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h1 id="message">...</h1>
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
      `,
      validate: (code, state) => state.message && state.message.length >= 8,
    },
    {
      id: 'strings',
      title: 'Cartão de apresentação',
      points: 10,
      explanation: [
        'Uma variável é um nome que damos a um valor. Podes imaginar uma variável como uma caixa com uma etiqueta. A etiqueta é o nome da variável; lá dentro fica guardado o valor.',
        'Neste exercício vais guardar o teu nome numa variável. Depois vais passar essa variável a uma função. Isto é importante porque, em programas maiores, raramente escrevemos tudo diretamente. Guardamos valores, damos-lhes nomes e reutilizamo-los.',
        'A parte : string é uma pista do TypeScript. Ela diz: esta variável deve guardar texto. Se mais tarde tentares guardar um número no mesmo sítio, o TypeScript consegue avisar-te.',
      ],
      instructions: [
        'Cria uma variável nome com tipo string.',
        'Escreve um detalhe sobre a pessoa ou personagem do cartão.',
        'Usa criarCartao(nome, detalhe) para preencher o cartão.',
      ],
      observation: 'O cartão deve mostrar o nome e uma frase descritiva. O importante é perceber que a função recebe valores que preparaste antes.',
      hint: 'Cria primeiro a variável com o nome. Depois usa essa variável quando chamares a função do cartão.',
      starter: 'const nome: string = "";\ncriarCartao(nome, "");',
      solution: 'const nome: string = "Ana";\ncriarCartao(nome, "gosta de astronomia");',
      html: `
        <main class="stage">
          <section class="panel">
            <p>Cartão</p>
            <h1 id="name">Nome</h1>
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
      `,
      validate: (code, state) => /:\s*string/.test(code) && state.name?.length >= 2 && state.detail?.length >= 5,
    },
  ],
});
