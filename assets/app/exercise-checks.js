window.exerciseChecksById = {
  intro: [
    { test: (_c, s) => s.message?.length >= 8, message: 'Chama mostrar com uma frase com pelo menos 8 caracteres.' },
    { test: (_c, s) => s.panelColor !== '#3b93ff' || s.messageSize !== 44, message: 'Muda a cor do painel ou o tamanho da mensagem nas Configurações Visuais.' },
  ],
  ola: [
    { test: (_c, s) => s.message?.length >= 8, message: 'Chama mostrar com uma mensagem tua (8+ caracteres).' },
  ],
  strings: [
    { test: (c) => /:\s*string/.test(c), message: 'Declara variáveis com tipo string (ex.: const nome: string = "...").' },
    { test: (_c, s) => s.name?.length >= 2, message: 'A variável do nome deve ter pelo menos 2 caracteres.' },
    { test: (_c, s) => s.detail?.length >= 5, message: 'A variável de detalhe deve ter pelo menos 5 caracteres.' },
  ],
  falar: [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput(...) para pedir dados ao utilizador.' },
    { test: (c) => /:\s*string/.test(c), message: 'Declara variáveis de texto com tipo string.' },
    { test: (_c, s) => s.name?.length >= 2, message: 'O nome introduzido deve ter pelo menos 2 caracteres.' },
    { test: (_c, s) => s.detail?.length >= 5, message: 'O detalhe introduzido deve ter pelo menos 5 caracteres.' },
  ],
  'numeros-precedencia': [
    { test: (c) => /\(a\s*\+\s*b\)/.test(c), message: 'Usa parênteses em (a + b) antes de multiplicar por c.' },
    { test: (_c, s) => s.result === 32, message: 'O resultado mostrado deve ser 32.' },
  ],
  'numeros-variavel': [
    { test: (c) => /\bd\s*:\s*number/.test(c), message: 'Cria a variável d com tipo number.' },
    { test: (c) => /mostrar\s*\(\s*d\s*\)/.test(c), message: 'Mostra o resultado com mostrar(d).' },
    { test: (c) => /(12\s*\*\s*7|7\s*\*\s*12)/.test(c), message: 'Calcula 12 * 7 em vez de escrever o resultado diretamente.' },
    { test: (_c, s) => s.result === 84, message: 'O resultado deve ser 84.' },
  ],
  'numeros-divisao': [
    { test: (_c, s) => Math.abs(Number(s.result) - 23412) < 0.01, message: 'O resultado da divisão deve ser 23412.' },
  ],
  'numeros-com-if': [
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para decidir o que mostrar.' },
    { test: (c) => /numero\s*>\s*5/.test(c), message: 'Compara a variável numero com 5 (numero > 5).' },
    { test: (_c, s) => { const m = String(s.result || '').match(/-?\d+/); return m !== null && Number(m[0]) > 5; }, message: 'Escolhe um número maior do que 5 (6 ou mais) para o resultado aparecer no ecrã.' },
  ],
  'numeros-divisao-zero': [
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para testar o divisor antes de dividir.' },
    { test: (c) => /divisor\s*={2,3}\s*0/.test(c), message: 'Verifica se o divisor é 0 (divisor === 0).' },
    { test: (_c, s) => /zero/i.test(String(s.result || '')), message: 'Quando o divisor é 0, mostra uma mensagem sobre divisão por zero.' },
  ],
  'calculadora-interativa': [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir os números.' },
    { test: (c) => /Number\s*\(/.test(c), message: 'Converte o texto para número com Number(...).' },
    { test: (_c, s) => typeof s.result === 'number' && !Number.isNaN(s.result), message: 'Mostra um resultado numérico válido no painel.' },
  ],
  'palavra-passe': [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir a palavra-passe.' },
    { test: (c) => /\.length/.test(c), message: 'Usa .length para contar os caracteres da palavra (ex.: palavra.length).' },
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para decidir se a palavra-passe é forte ou fraca.' },
    { test: (_c, s) => !!s.strength, message: 'Mostra o resultado com mostrar("forte") ou mostrar("fraca").' },
  ],
  listas: [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa um ciclo for para percorrer a lista.' },
    { test: (_c, s) => (s.fruits || []).length >= 3, message: 'Adiciona pelo menos 3 frutas à lista.' },
  ],
  aleatorio: [
    { test: (c) => /numeroAleatorio\s*\(\s*1\s*,\s*6\s*\)/.test(c), message: 'Chama numeroAleatorio(1, 6) para simular o dado.' },
    { test: (_c, s) => (typeof s.die === 'number' && s.die >= 1 && s.die <= 6) || (Array.isArray(s.dice) && s.dice.length >= 1), message: 'Executa o programa para lançar o dado pelo menos uma vez.' },
  ],
  booleanos: [
    { test: (c) => /:\s*boolean/.test(c), message: 'Usa uma variável boolean (ex.: const verde: boolean = ...).' },
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para escolher a cor do semáforo.' },
    { test: (_c, s) => ['verde', 'vermelho'].includes(s.color), message: 'O semáforo deve ficar verde ou vermelho.' },
  ],
  'par-impar': [
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para decidir se o número é par ou ímpar.' },
    { test: (c) => /%\s*2/.test(c), message: 'Usa o operador % (resto da divisão por 2).' },
    { test: (_c, s) => ['par', 'ímpar', 'impar'].includes(s.kind), message: 'Indica se o número é par ou ímpar.' },
  ],
  'semaforo-amarelo': [
    { test: (c) => /else\s+if/.test(c), message: 'Usa else if para tratar o caso do amarelo.' },
    { test: (c) => /estado\s*===/.test(c), message: 'Decide com base na variável estado (ex.: estado === "atenção").' },
    { test: (_c, s) => s.color === 'amarelo', message: 'Com o valor dado, o semáforo deve ficar amarelo.' },
  ],
  while: [
    { test: (c) => /\bwhile\s*\(/.test(c), message: 'Usa um ciclo while.' },
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput dentro do ciclo.' },
    { test: (_c, s) => s.done === true, message: 'Chama concluir() depois de receberes "sim".' },
    { test: (_c, s) => s.questions >= 1, message: 'Responde no terminal pelo menos uma vez.' },
  ],
  'adivinhar-numero': [
    { test: (c) => /\bwhile\s*\(/.test(c), message: 'Usa while para repetir até acertar.' },
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir palpites.' },
    { test: (c) => /\bif\s*\(/.test(c), message: 'Compara o palpite com o segredo usando if.' },
    { test: (_c, s) => s.guessed === true, message: 'Termina o jogo quando acertares no número.' },
  ],
  donatello: [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa for para repetir os lados do quadrado.' },
    { test: (_c, s) => (s.moves || []).filter((m) => m.type === 'forward' && m.value === 120).length >= 4, message: 'Anda 120 pixels para a frente em cada lado (4 vezes).' },
    { test: (_c, s) => (s.moves || []).filter((m) => ['right', 'left'].includes(m.type) && Math.abs(m.value) === 90).length >= 4, message: 'Roda 90 graus após cada lado (4 vezes).' },
  ],
  'donatello-circulo': [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa for com muitas repetições para a circunferência.' },
    { test: (_c, s) => (s.moves || []).filter((m) => m.type === 'forward' && m.value === 1).length >= 300, message: 'Em cada passo, anda 1 pixel (forward(1)).' },
    { test: (_c, s) => (s.moves || []).filter((m) => ['right', 'left'].includes(m.type) && Math.abs(m.value) === 1).length >= 300, message: 'Em cada passo, roda 1 grau (right(1) ou left(1)).' },
  ],
  'donatello-oito': [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa pelo menos um ciclo for.' },
    { test: (_c, s) => (s.moves || []).some((m) => m.type === 'right' && m.value > 0), message: 'Inclui rotações para a direita (right).' },
    { test: (_c, s) => (s.moves || []).some((m) => m.type === 'left' && m.value > 0), message: 'Inclui rotações para a esquerda (left).' },
    { test: (_c, s) => (s.moves || []).filter((m) => m.type === 'forward' && m.value > 0).length >= 250, message: 'Precisas de muitos passos para fechar o desenho do 8.' },
  ],
  'donatello-oito-if': [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa um único ciclo for.' },
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if dentro do ciclo para mudar a direção.' },
    { test: (_c, s) => (s.moves || []).filter((m) => m.type === 'forward' && m.value > 0).length >= 250, message: 'O desenho precisa de movimentos suficientes.' },
    { test: (_c, s) => (s.moves || []).some((m) => m.type === 'right' && m.value > 0) && (s.moves || []).some((m) => m.type === 'left' && m.value > 0), message: 'Usa right numa metade e left na outra.' },
  ],
  'donatello-roomba': [
    { test: (c) => /getX\s*\(\s*\)/.test(c) && /getY\s*\(\s*\)/.test(c), message: 'Usa donatello.getX() e donatello.getY() para ler a posição atual.' },
    { test: (c) => /numeroAleatorio/.test(c) || /Math\.random/.test(c), message: 'Usa numeroAleatorio(-5, 5) para girar ao calhas.' },
    { test: (c) => /\bif\s*\(/.test(c), message: 'Usa if para verificar se o Donatello sai do quadrado.' },
    { test: (_c, s) => !(s.visited || []).some(p => Math.abs(p.x) > 115 || Math.abs(p.y) > 115), message: 'O Donatello saiu dos limites do quadrado! Deteta as paredes e inverte o movimento.' },
    { test: (_c, s) => {
      const v = s.visited || [];
      return v.some(p => p.x < -60) && v.some(p => p.x > 60) && v.some(p => p.y > 60) && v.some(p => p.y < -60);
    }, message: 'O Donatello deve explorar o espaço e bater em todas as paredes (deve atingir as coordenadas perto de -100 e 100).' },
  ],
  cesar: [
    { test: (c) => /charCodeAt/.test(c) && /fromCharCode/.test(c), message: 'Transforma cada letra com charCodeAt e String.fromCharCode (não escrevas o resultado à mão).' },
    { test: (_c, s) => s.cipher === 'SPbY', message: 'A mensagem encriptada deve ser SPbY.' },
  ],
  'cesar-desencriptar': [
    { test: (_c, s) => s.plain === 'FCUL', message: 'A mensagem desencriptada deve ser FCUL.' },
  ],
  'cifra-interativa': [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir texto e deslocamento.' },
    { test: (_c, s) => s.cipher?.length >= 3, message: 'Mostra o texto encriptado no painel.' },
  ],
  formula: [
    { test: (c) => /Math\.sqrt/.test(c), message: 'Usa Math.sqrt para calcular a raiz do discriminante.' },
    { test: (_c, s) => Array.isArray(s.equation) && s.equation.length >= 2, message: 'Guarda os coeficientes da equação no estado.' },
    { test: (_c, s) => {
      const roots = s.roots || [];
      return Math.abs(roots[0] - 2) < 0.001 && Math.abs(roots[1] - 3) < 0.001;
    }, message: 'As raízes devem ser 2 e 3 para a equação dada.' },
  ],
  'pi-coordenadas': [
    { test: (c) => /Math\.random/.test(c), message: 'Usa Math.random para gerar coordenadas.' },
    { test: (c) => /criarPonto/.test(c), message: 'Chama criarPonto para cada par (x, y).' },
    { test: (_c, s) => (s.points || []).some((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1), message: 'Os pontos devem estar entre 0 e 1 em x e y.' },
  ],
  pi: [
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa for para lançar muitos dardos.' },
    { test: (c) => /Math\.random/.test(c), message: 'Usa Math.random em cada tentativa.' },
    { test: (c) => /criarPonto/.test(c) && /pontoDentro/.test(c), message: 'Cria pontos e testa com pontoDentro.' },
    { test: (_c, s) => s.total >= 1000, message: 'Lança pelo menos 1000 dardos.' },
    { test: (_c, s) => Math.abs(s.pi - Math.PI) < 0.25, message: 'A estimativa de pi deve estar perto de 3.14.' },
  ],
  'grafo-criar': [
    { test: (_c, s) => (s.nodes || []).length >= 4, message: 'Cria pelo menos 4 nós no grafo.' },
    { test: (_c, s) => (s.edges || []).length >= 3, message: 'Liga pelo menos 3 arestas entre nós.' },
  ],
  'grafo-caminho': [
    { test: (_c, s) => JSON.stringify(s.path) === JSON.stringify(['A', 'C', 'D']), message: 'O caminho destacado deve ser A → C → D.' },
  ],
  'rede-pesos': [
    { test: (c) => /adicionarNo/.test(c), message: 'Usa adicionarNo para criar nós com peso.' },
    { test: (c) => /ligar/.test(c), message: 'Usa ligar para criar ligações.' },
    { test: (_c, s) => (s.nodes || []).length >= 4, message: 'Adiciona pelo menos 4 nós.' },
    { test: (_c, s) => new Set((s.nodes || []).map((n) => n.peso)).size >= 3, message: 'Usa pelo menos 3 pesos diferentes nos nós.' },
  ],
  'arvore-procura': [
    { test: (c) => /number\[\]/.test(c), message: 'Declara a lista como number[].' },
    { test: (c) => /function\s+procurarNaLista/.test(c), message: 'Define a função procurarNaLista.' },
    { test: (c) => /\bfor\s*\(/.test(c) && /visitarLista/.test(c), message: 'Percorre a lista com for e visitarLista.' },
    { test: (c) => /mostrarLista/.test(c) && /criarArvore/.test(c) && /procurarNaArvore/.test(c), message: 'Mostra a lista, cria a árvore e procura nos dois.' },
    { test: (_c, s) => (s.listValues || []).length >= 5, message: 'A lista deve ter pelo menos 5 números.' },
    { test: (_c, s) => s.listTarget === s.treeTarget && (s.listValues || []).includes(s.listTarget), message: 'O alvo deve existir na lista e ser o mesmo nas duas procuras.' },
  ],
  arquiteto: [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir coordenadas.' },
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa for para comparar todos os pares de pontos.' },
    { test: (c) => /(Math\.hypot|Math\.sqrt)/.test(c), message: 'Calcula distâncias com Math.hypot ou Math.sqrt.' },
    { test: (_c, s) => (s.points || []).length >= 2, message: 'Introduz pelo menos 2 pontos.' },
    { test: (_c, s) => s.minDist !== null && s.maxDist !== null, message: 'Calcula e mostra a distância mínima e máxima.' },
  ],
  'mvp-futebol': [
    { test: (c) => /lerInput/.test(c), message: 'Usa await lerInput para pedir dados dos jogadores.' },
    { test: (c) => /\bfor\s*\(/.test(c), message: 'Usa for para processar cada jogador.' },
    { test: (c) => /\*\s*5/.test(c) && /\*\s*3/.test(c), message: 'A fórmula deve incluir golos×5 e assistências×3.' },
    { test: (_c, s) => (s.jogadores || []).length >= 2, message: 'Regista pelo menos 2 jogadores.' },
    { test: (_c, s) => s.vencedor && s.maxScore !== null, message: 'Anuncia o vencedor com anunciarVencedor.' },
  ],
  'const-let': [
    { test: (c) => /\blet\b/.test(c), message: 'Cria a variável total com let (não const), porque o valor vai mudar.' },
    { test: (c) => /total\s*=\s*total\s*\+/.test(c), message: 'Reatribui total, por exemplo total = total + 5.' },
    { test: (_c, s) => s.value === 8, message: 'O resultado deve ser 8 (0 + 5 + 3).' },
  ],
  'arrays-indices': [
    { test: (c) => /:\s*string\s*\[\s*\]/.test(c), message: 'Declara a lista como string[] (ex.: const cores: string[] = [...]).' },
    { test: (c) => /\[\s*1\s*\]/.test(c), message: 'Acede ao elemento no índice 1 (cores[1]).' },
    { test: (_c, s) => !!s.item && s.item !== 'undefined', message: 'Mostra um elemento válido da lista com mostrar.' },
  ],
  'ciclos-for': [
    { test: (c) => /for\s*\(\s*let\s+\w+\s*=/.test(c), message: 'Usa um for clássico com contador: for (let i = 1; i <= 10; i++).' },
    { test: (c) => /\bbreak\b/.test(c), message: 'Usa break para parar o ciclo quando a soma passar de 20.' },
    { test: (_c, s) => s.total === 21, message: 'A soma final deve ser 21 (1+2+3+4+5+6).' },
  ],
  'operadores-logicos': [
    { test: (c) => /&&|\|\|/.test(c), message: 'Usa um operador lógico: && (E) ou || (OU).' },
    { test: (c) => /:\s*boolean/.test(c), message: 'Guarda o resultado numa variável boolean.' },
    { test: (_c, s) => typeof s.logic === 'boolean', message: 'Mostra o resultado com mostrar.' },
  ],
  'arvore-intro': [
    { test: (c) => /number\s*\[\s*\]/.test(c), message: 'Declara a lista como number[] (ex.: const valores: number[] = [...]).' },
    { test: (c) => /criarArvore/.test(c), message: 'Chama criarArvore(valores) para construir a árvore.' },
    { test: (_c, s) => (s.treeValues || []).length >= 5, message: 'A lista deve ter pelo menos 5 números.' },
  ],
};
