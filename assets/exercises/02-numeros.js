window.exerciseTopics = window.exerciseTopics || [];

(() => {
  const resultApi = `
  function mostrarResultado(valor) {
    const result = Number(valor);
    setText('result', Number.isFinite(result) ? result : 'Erro');
    window.exerciseState.result = result;
  }
`;

  window.exerciseTopics.push({
    id: 'numeros',
    title: 'Números e Calculadoras',
    exercises: [
      {
        id: 'numeros-precedencia',
        title: 'A ordem das contas',
        points: 10,
        explanation: [
          'Os computadores fazem contas de forma muito parecida com a matemática que já conheces. Nem todas as operações acontecem da esquerda para a direita. Multiplicações e divisões têm prioridade sobre somas e subtrações.',
          'Quando queremos controlar a ordem, usamos parênteses. Os parênteses dizem ao computador: faz esta parte primeiro. Por isso a + b * c não é o mesmo que (a + b) * c.',
          'Esta ideia parece pequena, mas evita muitos erros em programas que calculam pontuações, preços, médias, áreas ou velocidades.',
        ],
        advanced: [
          'A ordem das operações chama-se precedência. Multiplicação, divisão e resto ([*], [/], [%]) têm precedência maior do que a soma e a subtração ([+], [-]), por isso são feitas primeiro. Os parênteses servem para forçar outra ordem.',
          'Quando duas operações têm a mesma precedência, são avaliadas da esquerda para a direita (associatividade à esquerda). Por exemplo, [10 - 3 - 2] é [(10 - 3) - 2], que dá 5, e não [10 - (3 - 2)].',
        ],
        animation: `
          <div class="ap">
            <style>
              .ap{font-family:Inter,system-ui,sans-serif;color:#1f2937}
              .ap .lbl{font-size:12px;font-weight:800;text-transform:uppercase;color:#64748b;letter-spacing:.04em}
              .ap .eq{font-size:23px;font-weight:800;margin:4px 0 14px;line-height:1.5}
              .ap .mul{background:#fde68a;border-radius:5px;padding:0 5px;animation:apPulse 3.6s infinite}
              @keyframes apPulse{0%,22%{background:#fde68a}42%,100%{background:#fef9c3}}
              .ap .res{color:#0077b6}
              .ap .s2{display:inline-block;opacity:0;animation:apShow 3.6s infinite}
              @keyframes apShow{0%,28%{opacity:0;transform:translateY(4px)}44%,100%{opacity:1;transform:none}}
              .ap .par{background:#bbf7d0;border-radius:5px;padding:0 5px}
            </style>
            <div class="lbl">Sem parênteses — a multiplicação vem primeiro</div>
            <div class="eq">5 + <span class="mul">3 × 4</span> <span class="s2">= 5 + 12 = <span class="res">17</span></span></div>
            <div class="lbl">Com parênteses — o objetivo</div>
            <div class="eq"><span class="par">(5 + 3)</span> × 4 = 8 × 4 = <span class="res">32</span></div>
          </div>
        `,
        instructions: [
          'Sem mudar os valores de a, b e c, faz com que a soma de a + b aconteça antes da multiplicação.',
          'Usa parênteses.',
          'Mostra o resultado final com [mostrarResultado(resultado)].',
        ],
        observation: 'O resultado correto é 32, porque primeiro fazemos 5 + 3 e depois multiplicamos por 4.',
        hint: 'Os parênteses obrigam o computador a fazer uma parte da conta primeiro.',
        starter: 'const a: number = 5;\nconst b: number = 3;\nconst c: number = 4;\n\nconst resultado: number = a + b * c;\nmostrarResultado(resultado);',
        solution: 'const a: number = 5;\nconst b: number = 3;\nconst c: number = 4;\n\nconst resultado: number = (a + b) * c;\nmostrarResultado(resultado);',
        html: `
        <main class="stage">
          <section class="panel">
            <h2 >Prioridade</h2>
            <p>Queremos calcular (5 + 3) * 4.</p>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
        api: resultApi,
        validate: (code, state) => /\(a\s*\+\s*b\)/.test(code) && state.result === 32,
      },
      {
        id: 'numeros-variavel',
        advanced: [
          'Guardar um valor numa variável antes de o usar permite reaproveitá-lo e dar-lhe um nome com significado. O computador calcula primeiro o lado direito do [=] e só depois guarda o resultado na variável à esquerda.',
        ],
        title: 'Guardar primeiro, mostrar depois',
        points: 10,
        explanation: [
          'Uma calculadora mostra o resultado de uma conta, mas um programa pode ir mais longe: pode guardar resultados intermédios para os usar depois.',
          'Neste exercício vais criar uma variável chamada d. Ela vai guardar o resultado de 12 * 7. Só depois vais mostrar d. Isto ajuda-te a separar duas ideias: calcular e apresentar.',
          'Esta separação é uma boa prática: quando o programa cresce, fica muito mais fácil perceber onde está a conta e onde está a interface.',
        ],
        instructions: [
          'Cria uma variável d do tipo number.',
          'Guarda nela o resultado de 12 * 7.',
          'No fim, chama [mostrarResultado(d)].',
        ],
        observation: 'O painel deve mostrar 84. O nome d tem de ser usado na chamada final.',
        hint: 'Cria uma variável numérica e usa essa variável na chamada mostrarResultado.',
        starter: '// cria a variável d aqui\n\n// mostra d aqui',
        solution: 'const d: number = 12 * 7;\nmostrarResultado(d);',
        html: `
        <main class="stage">
          <section class="panel">
            <h2>Variável d</h2>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
        api: resultApi,
        validate: (code, state) => /\bd\s*:\s*number/.test(code) && /mostrarResultado\s*\(\s*d\s*\)/.test(code) && /(12\s*\*\s*7|7\s*\*\s*12)/.test(code) && state.result === 84,
      },
      {
        id: 'numeros-divisao',
        advanced: [
          'O operador [/] devolve sempre um número com casas decimais quando a divisão não é exata — não existe divisão inteira automática. Para o resto usarias [%], e para arredondar [Math.floor] ou [Math.round].',
        ],
        title: 'Uma divisão grande',
        points: 10,
        explanation: [
          'Muitos programas existem para fazer contas que seriam chatas à mão. O computador não se importa se os números são grandes: ele segue a operação que lhe pedimos.',
          'Aqui vais dividir 28820172 por 1231. O mais importante não é decorar o resultado; é perceber que podes escrever expressões numéricas diretamente no código.',
          'Também vais ver que números com casas decimais aparecem naturalmente quando a divisão não dá um inteiro perfeito.',
        ],
        instructions: [
          'Calcula 28820172 dividido por 1231.',
          'Mostra o resultado com [mostrarResultado].',
        ],
        observation: 'O resultado esperado é 23412. A validação aceita esse valor com uma pequena margem.',
        hint: 'O operador / faz uma divisão. Podes passar uma conta diretamente para uma função.',
        starter: 'mostrarResultado();',
        solution: 'mostrarResultado(28820172 / 1231);',
        html: `
        <main class="stage">
          <section class="panel">
            <h2>Resultado</h2>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
        api: resultApi,
        validate: (code, state) => Math.abs(Number(state.result) - 23412) < 0.01,
      },
      {
        id: 'numeros-com-if',
        advanced: [
          'Uma condição dentro de um [if] é avaliada como verdadeira ou falsa (um booleano). [numero > 5] não guarda nada: é apenas uma pergunta cujo resultado decide se o bloco entre chavetas corre ou não.',
        ],
        title: 'Usando Condicionais',
        points: 10,
        explanation: [
          'Os condicionais permitem que o nosso código tome decisões.',
          'Um exemplo simples é decidir que ações tomar baseado em uma determinada condição.',
          'O computador consegue entender que precisa tomar decisão baseado em uma condição se for utilizada a palavra chave [if].',
          'Ao escrever [if(condicao){... código a ser executado para condição verdadeira ...}]',
          'Nesta atividade, modifique o código para garantir que somente vai imprimir o número selecionado se ele for maior do que 5.'
        ],
        instructions: [
          'Altere o valor da variável numero para verificar se o código funciona com valores diferentes.',
          'Se numero for maior do que 5, mostre o número'
        ],
        observation: 'Caso o número seja menor do que 5, o programa não deve fazer nada. Se o número for exatamente igual a 5, irá resultar numa mensagem diferente.',
        hint: 'Deve somente alterar o valor da variavel. O restante do código deve funcionar sem alterações',
        starter: 'const numero: number = -1;\n\nif (numero === 5){\n mostrarResultado(numero);\n}\n\nif (numero > 5) {\n  mostrarResultado(numero);\n}',
        solution: 'const numero: number = 10;\n\nif (numero === 5){\n mostrarResultado(numero);\n}\n\nif (numero > 5) {\n  mostrarResultado(numero);\n}',
        html: `
        <main class="stage">
          <section class="panel">
            <h2>Condicionais</h2>
            <p id="result">Nada foi inserido.</p>
          </section>
        </main>
      `,
        api: `
        function mostrarResultado(texto) {
          const message = "O resultado é " + String(texto);
          setText('result', message);
          window.exerciseState.result = message;
        }
        function mostrarErro(texto) {
          const message = "O resultado é " + String(texto);
          setText('result', message);
          window.exerciseState.result = message;
        }
      `,
        validate: (code, state) => {
          // 1. O código ainda tem a estrutura if com numero > 5
          const hasIfStructure = /\bif\s*\(/.test(code) && /numero\s*>\s*5/.test(code);

          // 2. O aluno definiu numero com um valor maior que 5
          const numeroMatch = code.match(/const\s+numero\s*(?::\s*number\s*)?=\s*(-?\d+)/);
          const numeroValue = numeroMatch ? parseInt(numeroMatch[1], 10) : null;
          const numeroIsAbove5 = numeroValue !== null && numeroValue > 5;

          // 3. O resultado foi mostrado no ecrã
          const resultShown = /O resultado é/.test(state.result || '');

          return hasIfStructure && numeroIsAbove5 && resultShown;
        },
      },
      {
        id: 'numeros-divisao-zero',
        advanced: [
          'Em JavaScript, dividir por zero não dá erro: dá [Infinity] (ou [NaN] em 0/0). Por isso testar o divisor antes com um [if] é a forma de evitar resultados sem sentido — a linguagem não te protege sozinha.',
        ],
        title: 'Dividir por zero',
        points: 15,
        explanation: [
          'Nem todas as contas fazem sentido. Dividir por zero é uma situação especial: em matemática, essa operação não está definida.',
          'Programar também é prever problemas. Em vez de deixar a conta correr e dar um resultado estranho, podemos testar antes. Para isso usamos [if].',
          'Um [if] lê-se como “se isto for verdade, então faz aquilo”. Neste exercício, o programa deve perguntar: o divisor é zero? Se sim, mostra uma mensagem de erro.',
          'Caso contrário [else{...}] faça o que seria esperado, i.e., divisão do dividendo pelo divisor, utilizando [mostrarResultado(...);]',
        ],
        instructions: [
          'Cria uma variável divisor com o valor 0.',
          'Cria uma variável dividendo com o valor 5',
          'Usa if para verificar se o divisor é zero.',
          'Se for zero, chama [mostrarErro("Não posso dividir por zero");].',
          'Caso contrário [else{...}] faça o que seria esperado, i.e., divisão do dividendo pelo divisor, utilizando [mostrarResultado(...);]',
        ],
        observation: 'O resultado correto não é uma conta; é uma mensagem clara para a pessoa que usa o programa.',
        hint: 'Antes de dividir, usa uma decisão: se o divisor for zero, mostra uma mensagem de erro em vez de fazer a conta.',
        starter: '// crie a variável divisor aqui;\n\n// crie a variável dividendo aqui;\n\n// testa o divisor aqui',
        solution: 'const divisor: number = 0;\nconst dividendo: number = 5;\n\nif (divisor === 0) {\n  mostrarErro("Não posso dividir por zero");\n} else {\n  mostrarResultado(dividendo / divisor);\n}',
        html: `
        <main class="stage">
          <section class="panel">
            <h2>Divisão</h2>
            <p id="result">Ainda sem teste.</p>
          </section>
        </main>
      `,

        api: `
        function mostrarResultado(texto) {
          const message = String(texto);
          setText('result', message);
          window.exerciseState.result = message;
        }
        function mostrarErro(texto) {
          const message = String(texto);
          setText('result', message);
          window.exerciseState.result = message;
        }
      `,
        validate: (code, state) => /\bif\s*\(/.test(code) && /divisor\s*={2,3}\s*0/.test(code) && /zero/i.test(state.result || ''),
      },
      {
        id: 'palavra-passe',
        title: 'Palavra-passe forte',
        points: 15,
        interactive: true,
        terminal: true,
        explanation: [
          'Uma string (texto) é, na prática, uma lista de caracteres. A palavra "ola" tem três caracteres: o, l e a.',
          'Quando queremos saber quantos caracteres tem uma palavra, usamos [.length]. Por exemplo, o valor de ["ola".length] é 3.',
          'Neste exercício vais pedir uma palavra-passe ao utilizador e usar [.length] para validar o seu comprimento: consideramos uma palavra-passe forte quando tem pelo menos 6 caracteres.',
        ],
        advanced: [
          'Por baixo, uma [string] é uma sequência de unidades de código (em JavaScript/TypeScript, UTF-16). O [.length] conta essas unidades, que para letras normais coincidem com o número de caracteres que vês.',
          'Há exceções curiosas: alguns emojis e certas letras acentuadas combinadas podem contar como mais do que uma unidade. Para palavras-passe normais isto não acontece, mas fica a saber que [.length] nem sempre é igual ao número de símbolos que uma pessoa vê no ecrã.',
        ],
        instructions: [
          'Pede uma palavra-passe ao utilizador com [await lerInput("...")].',
          'Descobre o número de caracteres com [palavra.length].',
          'Usa [if] e [else]: se tiver pelo menos 6 caracteres, chama [mostrarForca("forte")]; caso contrário chama [mostrarForca("fraca")].',
        ],
        observation: 'Experimenta palavras curtas e longas no terminal para veres o resultado mudar entre forte e fraca.',
        hint: 'Uma string é uma lista de caracteres. Usa [.length] para saber quantas letras tem a palavra e validar o comprimento. Por exemplo, [palavra.length >= 6] é verdadeiro quando a palavra tem 6 ou mais caracteres.',
        starter: 'const palavra: string = await lerInput("Escolhe uma palavra-passe:");\n\n// descobre o comprimento com palavra.length\n\n// se tiver pelo menos 6 caracteres, mostra "forte"; caso contrário "fraca"',
        solution: 'const palavra: string = await lerInput("Escolhe uma palavra-passe:");\n\nconst comprimento: number = palavra.length;\n\nif (comprimento >= 6) {\n  mostrarForca("forte");\n} else {\n  mostrarForca("fraca");\n}',
        html: `
        <main class="stage">
          <section class="panel dark">
            <h2>🔒 Palavra-passe</h2>
            <p>Comprimento: <span id="length">—</span> caracteres</p>
            <div class="big-value" id="strength">?</div>
          </section>
        </main>
      `,
        api: `
        function mostrarForca(forca) {
          const value = String(forca).toLowerCase();
          const el = document.getElementById('strength');
          if (el) {
            el.textContent = value === 'forte' ? '💪 Forte' : '⚠️ Fraca';
            el.style.color = value === 'forte' ? '#4ade80' : '#f87171';
          }
          window.exerciseState.strength = value;
        }
        const _origLerInputPwd = lerInput;
        lerInput = async function(msg) {
          var val = await _origLerInputPwd(msg);
          setText('length', String(val).length);
          window.exerciseState.word = String(val);
          window.exerciseState.wordLength = String(val).length;
          return val;
        };
      `,
        validate: (code, state) => {
          const hasLerInput = /lerInput/.test(code);
          const usesLength = /\.length/.test(code);
          const hasIf = /\bif\s*\(/.test(code);
          if (!hasLerInput || !usesLength || !hasIf) return false;
          if (typeof state.wordLength !== 'number' || !state.strength) return false;
          const expected = state.wordLength >= 6 ? 'forte' : 'fraca';
          return state.strength === expected;
        },
      },
    ],
  });
})();
