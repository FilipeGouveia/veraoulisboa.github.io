// Interactive overrides (terminal + lerInput). Loaded after other exercise files;
// same ids replace earlier definitions. Order is set in assets/app/curriculum.js.
window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'interativo',
  title: 'Programas Interativos',
  exercises: [
    {
      id: 'adivinhar-numero',
      animation: '<div class="cax"><div class="lbl">segredo = 23</div><div class="big"><span class="cax-pop">30 alto</span> <span class="cax-pop d1">20 baixo</span> <span class="cax-pop d2 ok">23 ✓</span></div></div>',
      advanced: [
        'A palavra [await] suspende o programa até a resposta chegar, sem bloquear o resto da página. É por isso que um [while] com [await lerInput] consegue esperar por ti em cada volta — algo essencial em programas interativos e em pedidos pela internet.',
      ],
      title: 'Adivinhar o número',
      points: 35,
      interactive: true,
      terminal: true,
      explanation: [
        'Este exercício é um jogo. O computador escolhe um número secreto e tu tens de adivinhar. Em cada tentativa, recebes uma dica: "muito alto" ou "muito baixo".',
        'No terminal original, este tipo de jogo usava o teclado diretamente. Aqui, a função [lerInput] faz o mesmo: o programa pára e espera que escrevas algo no terminal abaixo do painel.',
        'A palavra [await] antes de [lerInput] significa "espera pela resposta". Sem ela, o programa continuaria sem esperar. Com ela, o ciclo [while] repete e espera em cada volta.',
      ],
      instructions: [
        'O número secreto já está na variável [segredo] (entre 1 e 50).',
        'Dentro do [while], usa [await lerInput("...")] para pedir um palpite.',
        'Converte o texto para número com [Number()].',
        'Se o palpite for menor, escreve "Muito baixo!". Se for maior, escreve "Muito alto!".',
        'Se acertar, escreve uma mensagem de vitória e muda [acertou] para true.',
      ],
      observation: 'Usa o terminal abaixo do painel visual para interagir com o programa. O jogo termina quando acertares.',
      hint: 'Dentro do [while], pede um número, compara com o [segredo] usando [if] / [else if] / [else], e atualiza [acertou] quando o palpite estiver certo.',
      starter: 'const segredo: number = numeroSecreto(1, 50);\nlet acertou: boolean = false;\nlet tentativas: number = 0;\n\nescrever("Pensei num número entre 1 e 50. Tenta adivinhar!");\n\nwhile (!acertou) {\n  const texto = await lerInput("Qual é o teu palpite?");\n  const palpite: number = Number(texto);\n  tentativas = tentativas + 1;\n\n  // compara o palpite com o segredo aqui\n  // usa escrever() para dar dicas\n}\n\nescrever("Precisaste de " + tentativas + " tentativas.");',
      solution: 'const segredo: number = numeroSecreto(1, 50);\nlet acertou: boolean = false;\nlet tentativas: number = 0;\n\nescrever("Pensei num número entre 1 e 50. Tenta adivinhar!");\n\nwhile (!acertou) {\n  const texto = await lerInput("Qual é o teu palpite?");\n  const palpite: number = Number(texto);\n  tentativas = tentativas + 1;\n\n  if (palpite < segredo) {\n    escrever("Muito baixo! Tenta um número maior.");\n  } else if (palpite > segredo) {\n    escrever("Muito alto! Tenta um número menor.");\n  } else {\n    escrever("Acertaste! O número era " + segredo + "!");\n    acertou = true;\n  }\n}\n\nescrever("Precisaste de " + tentativas + " tentativas.");',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2>🎯 Adivinhar o número</h2>
            <p id="status">A pensar num número…</p>
            <div class="big-value" id="attempts">0</div>
            <p>tentativas</p>
          </section>
        </main>
      `,
      api: `
        function numeroSecreto(min, max) {
          const low = Math.ceil(Number(min));
          const high = Math.floor(Number(max));
          const secret = Math.floor(Math.random() * (high - low + 1)) + low;
          window.exerciseState.secret = secret;
          window.exerciseState.guessed = false;
          window.exerciseState.attempts = 0;
          window.exerciseState.lastGuess = null;
          return secret;
        }
        const _origEscrever = escrever;
        const _origLerInput = lerInput;
        escrever = function() {
          _origEscrever.apply(null, arguments);
          if (window.exerciseState.lastGuess === window.exerciseState.secret) {
            window.exerciseState.guessed = true;
            setText('status', '🎉 Acertaste!');
          }
        };
        lerInput = async function(msg) {
          var val = await _origLerInput(msg);
          var num = Number(val);
          if (!isNaN(num) && val.trim() !== '') {
            window.exerciseState.attempts++;
            window.exerciseState.lastGuess = num;
            setText('attempts', window.exerciseState.attempts);
          }
          return val;
        };
      `,
      validate: (code, state) => {
        // 1. Tem ciclo while
        const hasWhile = /\bwhile\s*\(/.test(code);

        // 2. Usa lerInput dentro do código
        const hasLerInput = /\blerInput\s*\(/.test(code);

        // 3. Tem estrutura if/else if/else para comparar
        const hasIfElse = /\bif\s*\(/.test(code) && /\belse\b/.test(code);

        // 4. Compara o palpite com o segredo (< e >)
        const hasComparisons = /palpite\s*[<>]\s*segredo|segredo\s*[<>]\s*palpite/.test(code);

        // 5. Muda acertou para true algures
        const setsAcertou = /acertou\s*=\s*true/.test(code);

        // 6. O jogo foi realmente concluído com sucesso
        const gameWon = state.guessed === true;

        return hasWhile && hasLerInput && hasIfElse && hasComparisons && setsAcertou && gameWon;
      },
    },
    {
      id: 'calculadora-interativa',
      animation: '<div class="cax"><div class="lbl">lerInput devolve texto</div><div class="big">"2" + "3" = <span class="bad">"23"</span></div><div class="big ok cax-step">Number("2") + Number("3") = 5</div></div>',
      advanced: [
        '[lerInput] devolve sempre uma [string], mesmo quando escreves um número. Somar duas strings junta-as ("2" + "3" dá "23"), por isso converter com [Number()] antes de calcular é obrigatório e uma fonte comum de bugs.',
      ],
      title: 'Calculadora com input',
      points: 20,
      interactive: true,
      terminal: true,
      explanation: [
        'Até agora, os números estavam escritos diretamente no código. Mas um programa de verdade recebe dados de quem o usa.',
        'A função lerInput devolve sempre texto. Para fazer contas, precisamos de converter esse texto num número com [Number()].',
        'Este padrão (pedir, converter, calcular) é muito comum em qualquer linguagem de programação.',
      ],
      instructions: [
        'Pede dois números ao utilizador com [await lerInput()].',
        'Converte os textos para números com [Number()].',
        'Calcula a soma e mostra com [mostrarResultado()].',
        'Usa [escrever()] para mostrar uma mensagem com o resultado.',
      ],
      observation: 'Escreve os números no terminal abaixo do painel. O resultado aparece no painel visual e no terminal.',
      hint: '[lerInput] devolve texto. Usa [Number()] para converter antes de somar.',
      starter: 'const textoA = await lerInput("Escreve o primeiro número:");\nconst textoB = await lerInput("Escreve o segundo número:");\n\nconst a: number = Number(textoA);\nconst b: number = Number(textoB);\n\n// calcula e mostra o resultado',
      solution: 'const textoA = await lerInput("Escreve o primeiro número:");\nconst textoB = await lerInput("Escreve o segundo número:");\n\nconst a: number = Number(textoA);\nconst b: number = Number(textoB);\n\nconst soma: number = a + b;\nescrever("A soma de " + a + " + " + b + " = " + soma);\nmostrarResultado(soma);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Calculadora</h2>
            <p>Resultado:</p>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrarResultado(valor) {
          const result = Number(valor);
          setText('result', Number.isFinite(result) ? result : 'Erro');
          window.exerciseState.result = result;
        }
      `,
      validate: (code, state) =>
        /lerInput/.test(code) &&
        /Number\s*\(/.test(code) &&
        typeof state.result === 'number' &&
        !isNaN(state.result),
    },
    {
      id: 'cifra-interativa',
      advanced: [
        'Separar a função que transforma os dados ([cifrar]) da parte que pede e mostra é um bom hábito: a mesma função serve para qualquer texto e podes testá-la isoladamente. Reutilizar funções é a base de programas maiores.',
      ],
      title: 'Cifra a tua mensagem',
      points: 25,
      interactive: true,
      terminal: true,
      explanation: [
        'No exercício da cifra de César, o texto a cifrar estava fixo no código. Agora vais pedir ao utilizador que escreva a sua própria mensagem.',
        'A função cifrar percorre cada letra e avança-a 13 posições na tabela de caracteres. Desta vez, a função já está pronta — o desafio é ligar a interação ao código.',
        'Este exercício mostra como combinar input do utilizador com uma função que transforma dados.',
      ],
      instructions: [
        'Pede uma mensagem ao utilizador com [await lerInput].',
        'Chama [cifrar(mensagem)] para obter o texto cifrado.',
        'Mostra o resultado com [escrever()] e [mostrarCifra()].',
      ],
      observation: 'Escreve qualquer texto no terminal. O painel mostra a versão cifrada.',
      hint: 'Guarda o resultado de [lerInput] numa variável. Passa essa variável para [cifrar].',
      starter: 'function cifrar(texto: string): string {\n  let resultado: string = "";\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) + 13);\n  }\n  return resultado;\n}\n\n// pede a mensagem e mostra a cifra',
      solution: 'function cifrar(texto: string): string {\n  let resultado: string = "";\n  for (const letra of texto) {\n    resultado += String.fromCharCode(letra.charCodeAt(0) + 13);\n  }\n  return resultado;\n}\n\nconst mensagem = await lerInput("Escreve a tua mensagem secreta:");\nconst cifrada: string = cifrar(mensagem);\nescrever("Cifrada: " + cifrada);\nmostrarCifra(cifrada);',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2>🔐 Cifra de César</h2>
            <p>Mensagem original:</p>
            <p id="original" style="font-size:18px;font-weight:700;color:#60a5fa;">…</p>
            <p>Mensagem cifrada:</p>
            <div class="big-value" id="cipher" style="font-size:clamp(24px,6vw,42px);word-break:break-all;">?</div>
          </section>
        </main>
      `,
      api: `
        function mostrarCifra(texto) {
          const cipher = String(texto);
          setText('cipher', cipher);
          window.exerciseState.cipher = cipher;
        }
        const _origLerInputCifra = lerInput;
        lerInput = async function(msg) {
          var val = await _origLerInputCifra(msg);
          setText('original', val);
          window.exerciseState.original = val;
          return val;
        };
      `,
      validate: (code, state) =>
        /lerInput/.test(code) &&
        state.cipher &&
        state.cipher.length >= 1 &&
        state.original &&
        state.cipher !== state.original,
    },
    {
      id: 'falar',
      animation: '<div class="cax"><div class="lbl">lerInput("Como te chamas?")</div><div class="big">🪪 <span class="accent cax-step">Ana</span></div></div>',
      advanced: [
        'O [await] faz o programa esperar pela resposta antes de continuar. Sem ele, [lerInput] devolveria uma promessa (um valor que ainda não chegou) e o resto do código correria cedo demais — um erro muito comum com input e pedidos à internet.',
      ],
      title: 'Falar com o programa',
      points: 15,
      interactive: true,
      terminal: true,
      explanation: [
        'Até agora, o programa tem mostrado coisas no ecrã, mas não tem recebido nenhuma informação de volta. E se quisermos que o programa saiba o nosso nome para nos cumprimentar? Ou que peça a nossa cor favorita para mudar a cor do painel?',
        'Para isso, precisamos de dar ao programa a capacidade de receber input. No terminal que aparece na parte inferior, podemos pedir ao utilizador para escrever algo. O programa pode então usar essa informação para fazer coisas diferentes.',
        'A palavra [await] faz com que o programa espere até o utilizador escrever a resposta. Sem [await], o programa continuaria antes de receber a resposta do terminal.',
      ],
      instructions: [
        'Usa [await lerInput()] para pedir ao utilizador que escreva algo.',
        'Quando o utilizador submeter o input, guarda-o numa variável e mostra um cartão personalizado usando esse input.',
        'Experimenta utilizar a função [escrever("")] para mostrar mensagens no terminal',
      ],
      observation:
        'Podes experimentar criar mais variáveis e concatená-las para criar mensagens mais complexas. Experimenta fazer [const fraseCompleta = nome + " " + detalhe;] e depois mostrar essa frase completa no cartão.',
      hint: 'Usa [await lerInput()] substituindo [""] para guardar o nome e um detalhe em variáveis, e passa essas variáveis para [criarCartao()].',
      starter: '// utilize a função escrever("") para mostrar mensagens no terminal;\n// utilize a função await lerInput para obter o nome e um detalhe em variáveis;\nconst nome: string = "";\nconst detalhe: string = "";\n\ncriarCartao(nome, detalhe);\n\nmudarCorCartao("#ffffff");\nmudarTamanhoNome(48);',
      solution: 'escrever("Olá!");\nconst nome: string = await lerInput("Como te chamas?");\nconst detalhe: string = await lerInput("Escreve um detalhe sobre ti:");\n\ncriarCartao(nome, detalhe);\n\nmudarCorCartao("#ffffff");\nmudarTamanhoNome(48);',
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
      validate: (code, state) => /lerInput/.test(code) && /:\s*string/.test(code) && state.name?.length >= 2 && state.detail?.length >= 5,
    },
  ],
});
