window.exerciseTopics = window.exerciseTopics || [];

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
      instructions: [
        'Sem mudar os valores de a, b e c, faz com que a soma de a + b aconteça antes da multiplicação.',
        'Usa parênteses.',
        'Mostra o resultado final com mostrarResultado(resultado).',
      ],
      observation: 'O resultado correto é 32, porque primeiro fazemos 5 + 3 e depois multiplicamos por 4.',
      hint: 'Os parênteses obrigam o computador a fazer uma parte da conta primeiro.',
      starter: 'const a: number = 5;\nconst b: number = 3;\nconst c: number = 4;\n\nconst resultado: number = a + b * c;\nmostrarResultado(resultado);',
      solution: 'const a: number = 5;\nconst b: number = 3;\nconst c: number = 4;\n\nconst resultado: number = (a + b) * c;\nmostrarResultado(resultado);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Prioridade</h1>
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
        'No fim, chama mostrarResultado(d).',
      ],
      observation: 'O painel deve mostrar 84. O nome d tem de ser usado na chamada final.',
      hint: 'Cria uma variável numérica e usa essa variável na chamada mostrarResultado.',
      starter: '// cria a variável d aqui\n\n// mostra d aqui',
      solution: 'const d: number = 12 * 7;\nmostrarResultado(d);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Variável d</h1>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
      api: resultApi,
      validate: (code, state) => /\bd\s*:\s*number/.test(code) && /mostrarResultado\s*\(\s*d\s*\)/.test(code) && state.result === 84,
    },
    {
      id: 'numeros-divisao',
      title: 'Uma divisão grande',
      points: 10,
      explanation: [
        'Muitos programas existem para fazer contas que seriam chatas à mão. O computador não se importa se os números são grandes: ele segue a operação que lhe pedimos.',
        'Aqui vais dividir 28820172 por 1231. O mais importante não é decorar o resultado; é perceber que podes escrever expressões numéricas diretamente no código.',
        'Também vais ver que números com casas decimais aparecem naturalmente quando a divisão não dá um inteiro perfeito.',
      ],
      instructions: [
        'Calcula 28820172 dividido por 1231.',
        'Mostra o resultado com mostrarResultado.',
      ],
      observation: 'O resultado esperado é 23412. A validação aceita esse valor com uma pequena margem.',
      hint: 'O operador / faz uma divisão. Podes passar uma conta diretamente para uma função.',
      starter: 'mostrarResultado();',
      solution: 'mostrarResultado(28820172 / 1231);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Resultado</h1>
            <div class="big-value" id="result">?</div>
          </section>
        </main>
      `,
      api: resultApi,
      validate: (code, state) => Math.abs(Number(state.result) - 23412) < 0.01,
    },
    {
      id: 'numeros-divisao-zero',
      title: 'Dividir por zero',
      points: 10,
      explanation: [
        'Nem todas as contas fazem sentido. Dividir por zero é uma situação especial: em matemática, essa operação não está definida.',
        'Programar também é prever problemas. Em vez de deixar a conta correr e dar um resultado estranho, podemos testar antes. Para isso usamos if.',
        'Um if lê-se como “se isto for verdade, então faz aquilo”. Neste exercício, o programa deve perguntar: o divisor é zero? Se sim, mostra uma mensagem de erro.',
      ],
      instructions: [
        'Cria uma variável divisor com o valor 0.',
        'Usa if para verificar se o divisor é zero.',
        'Se for zero, chama mostrarErro("Não posso dividir por zero").',
      ],
      observation: 'O resultado correto não é uma conta; é uma mensagem clara para a pessoa que usa o programa.',
      hint: 'Antes de dividir, usa uma decisão: se o divisor for zero, mostra uma mensagem de erro em vez de fazer a conta.',
      starter: 'const divisor: number = 0;\n\n// testa o divisor aqui',
      solution: 'const divisor: number = 0;\n\nif (divisor === 0) {\n  mostrarErro("Não posso dividir por zero");\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Divisão</h1>
            <p id="error">Ainda sem teste.</p>
          </section>
        </main>
      `,
      api: `
        function mostrarErro(texto) {
          const message = String(texto);
          setText('error', message);
          window.exerciseState.error = message;
        }
      `,
      validate: (code, state) => /\bif\s*\(/.test(code) && /divisor\s*={2,3}\s*0/.test(code) && /zero/i.test(state.error || ''),
    },
  ],
});
