window.exerciseTopics = window.exerciseTopics || [];

function donatelloApi() {
  return `
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let turtleDraw = { x: 190, y: 120, angle: 0 };
    let animationDelay = 14;
    let drawingColor = '#2f5d78';
    let drawingWidth = 4;
    const queuedMoves = [];
    const drawnSegments = [];
    ctx.lineWidth = drawingWidth;
    ctx.strokeStyle = drawingColor;
    ctx.lineCap = 'round';
    window.exerciseState.moves = [];
    window.exerciseState.visited = [];

    let logicalX = 0;
    let logicalY = 0;
    let logicalAngle = 0;

    const donatello = {
      forward(distance) {
        const value = Number(distance);
        queuedMoves.push({ type: 'forward', value });
        window.exerciseState.moves.push({ type: 'forward', value });

        const rad = logicalAngle * Math.PI / 180;
        logicalX += Math.cos(rad) * value;
        logicalY += Math.sin(rad) * value;
        window.exerciseState.visited.push({ x: logicalX, y: logicalY });
      },
      right(angle) {
        const value = Number(angle);
        queuedMoves.push({ type: 'right', value });
        window.exerciseState.moves.push({ type: 'right', value });
        logicalAngle += value;
      },
      left(angle) {
        const value = Number(angle);
        queuedMoves.push({ type: 'left', value });
        window.exerciseState.moves.push({ type: 'left', value });
        logicalAngle -= value;
      },
      position(x, y) {
        const nextX = Number(x);
        const nextY = Number(y);
        queuedMoves.push({ type: 'position', x: nextX, y: nextY });
        window.exerciseState.start = { x: nextX, y: nextY };
        logicalX = (nextX - 260) / 1.5;
        logicalY = (180 - nextY) / 1.5;
      },
      speed(mode) {
        const value = String(mode).toLowerCase();
        if (value === 'rapido' || value === 'rápido') animationDelay = 4;
        if (value === 'normal') animationDelay = 14;
        if (value === 'lento') animationDelay = 35;
        window.exerciseState.speed = value;
      },
      color(cor) {
        drawingColor = String(cor);
        window.exerciseState.drawingColor = drawingColor;
      },
      width(tamanho) {
        drawingWidth = Number(tamanho);
        window.exerciseState.drawingWidth = drawingWidth;
      },
      getX() {
        return logicalX;
      },
      getY() {
        return logicalY;
      },
      getAngle() {
        return logicalAngle;
      }
    };

    function drawTurtle() {
      ctx.save();
      ctx.translate(turtleDraw.x, turtleDraw.y);
      ctx.rotate(turtleDraw.angle * Math.PI / 180);
      ctx.fillStyle = '#374151';
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(13, 0);
      ctx.lineTo(-9, -7);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-9, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function drawRoombaSquare() {
      if (!window.exerciseState.isRoomba) return;
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(110, 30, 300, 300);
      ctx.restore();
    }

    function drawPath(tempSegment) {
      ctx.save();
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = drawingWidth;
      ctx.lineCap = 'round';
      for (const segment of drawnSegments) {
        ctx.beginPath();
        ctx.moveTo(segment.start.x, segment.start.y);
        ctx.lineTo(segment.end.x, segment.end.y);
        ctx.stroke();
      }
      if (tempSegment) {
        ctx.beginPath();
        ctx.moveTo(tempSegment.start.x, tempSegment.start.y);
        ctx.lineTo(tempSegment.end.x, tempSegment.end.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function renderScene(tempSegment) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoombaSquare();
      drawPath(tempSegment);
      drawTurtle();
    }

    window.playAnimation = async function playAnimation() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoombaSquare();
      drawnSegments.length = 0;
      turtleDraw = { x: 190, y: 120, angle: 0 };
      await new Promise((resolve) => setTimeout(resolve, 160));

      for (const move of queuedMoves) {
        if (move.type === 'position') {
          turtleDraw.x = move.x;
          turtleDraw.y = move.y;
          renderScene();
        }
        if (move.type === 'right') turtleDraw.angle += move.value;
        if (move.type === 'left') turtleDraw.angle -= move.value;
        if (move.type === 'forward') {
          const start = { ...turtleDraw };
          const radians = turtleDraw.angle * Math.PI / 180;
          const factor = window.exerciseState.isRoomba ? 1.5 : 1;
          const end = {
            x: turtleDraw.x + Math.cos(radians) * move.value * factor,
            y: turtleDraw.y + Math.sin(radians) * move.value * factor,
          };
          const frames = window.exerciseState.isRoomba
            ? Math.max(1, Math.ceil(Math.abs(move.value * factor) / 5))
            : Math.max(8, Math.min(40, Math.ceil(Math.abs(move.value) / 5)));
          for (let frame = 1; frame <= frames; frame++) {
            const t = frame / frames;
            turtleDraw.x = start.x + (end.x - start.x) * t;
            turtleDraw.y = start.y + (end.y - start.y) * t;
            renderScene({ start, end: { x: turtleDraw.x, y: turtleDraw.y } });
            await new Promise((resolve) => setTimeout(resolve, animationDelay));
          }
          drawnSegments.push({ start, end });
          turtleDraw = { ...end, angle: turtleDraw.angle };
          renderScene();
        }
        await new Promise((resolve) => setTimeout(resolve, animationDelay * 4));
      }
    };
  `;
}

window.exerciseTopics.push({
  id: 'donatello',
  title: 'Donatello e Movimento',
  exercises: [
    {
      id: 'donatello',
      title: 'Desenha um quadrado',
      points: 20,
      explanation: [
        'A tartaruga é uma forma visual de aprender programação. Em vez de pensar primeiro em fórmulas, pensas em ações: andar para a frente, virar à direita, virar à esquerda.',
        'Para desenhar um quadrado, repetimos sempre a mesma ideia: andar um lado e virar 90 graus. Como o quadrado tem quatro lados, fazemos isto quatro vezes.',
        'A tartaruga move-se no ecrã para que possas ver a sequência. Se a figura não fechar, há provavelmente um erro no ângulo ou no número de repetições.',
      ],
      instructions: [
        'Usa um ciclo [for] para repetir 4 vezes.',
        'Em cada repetição, anda 120 pixeis.',
        'Depois roda 90 graus.',
        'Se quiseres, muda a posição inicial com [donatello.position(x, y)].',
        'Experimenta [donatello.speed("lento"), "normal" ou "rapido"].',
        'Altera a cor e a grossura da linha nos controlos visuais.',
      ],
      observation: 'A figura deve formar quatro lados iguais. A animação mostra a ordem das instruções.',
      hint: 'Para um quadrado, repete quatro vezes: anda um lado, depois vira um canto de 90 graus.',
      starter: 'donatello.speed("normal");\ndonatello.position(190, 120);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\n// cria o ciclo do quadrado aqui',
      solution: 'donatello.speed("rapido");\ndonatello.position(190, 120);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\nfor (let i = 0; i < 4; i++) {\n  donatello.forward(120);\n  donatello.right(90);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Donatello</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      visualControls: [
        {
          label: 'Cor da linha',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'donatello\\.color\\("([^"]+)"\\);?',
          template: (value) => `donatello.color("${value}");`,
        },
        {
          label: 'Grossura da linha',
          type: 'range',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 4,
          pattern: 'donatello\\.width\\((\\d+)\\);?',
          template: (value) => `donatello.width(${value});`,
        },
      ],
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          moves.filter((move) => move.type === 'forward' && move.value === 120).length >= 4 &&
          moves.filter((move) => ['right', 'left'].includes(move.type) && Math.abs(move.value) === 90).length >= 4;
      },
    },
    {
      id: 'donatello-circulo',
      title: 'Desenha uma circunferência',
      points: 20,
      explanation: [
        'Uma circunferência parece uma curva suave, mas o computador pode aproximá-la com muitos passos pequenos.',
        'Se a tartaruga andar 1 pixel e rodar 1 grau, e repetir isso 360 vezes, no fim terá dado uma volta completa: 360 graus.',
        'Isto mostra uma ideia importante: muitas formas complexas podem ser construídas com instruções simples repetidas muitas vezes.',
      ],
      instructions: [
        'Usa um ciclo [for] com 36 repetições.',
        'Em cada volta, anda 10 pixel.',
        'Em cada volta, roda 10 grau.',
        'Experimenta a cor e a grossura da linha para comparar estilos.',
      ],
      observation: 'A circunferência pode não ficar matematicamente perfeita, mas deve parecer uma volta fechada.',
      hint: 'Uma volta completa tem 360 graus. Podes fazer muitos passos pequenos, rodando um pouco em cada passo.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\n// cria o ciclo da circunferência aqui',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\nfor (let i = 0; i < 360; i++) {\n  donatello.forward(1);\n  donatello.right(1);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Circunferência</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      visualControls: [
        {
          label: 'Cor da linha',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'donatello\\.color\\("([^"]+)"\\);?',
          template: (value) => `donatello.color("${value}");`,
        },
        {
          label: 'Grossura da linha',
          type: 'range',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 4,
          pattern: 'donatello\\.width\\((\\d+)\\);?',
          template: (value) => `donatello.width(${value});`,
        },
      ],
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          moves.filter((move) => move.type === 'forward' && move.value === 10).length >= 30 &&
          moves.filter((move) => ['right', 'left'].includes(move.type) && Math.abs(move.value) === 10).length >= 30;
      },
    },
    {
      id: 'donatello-oito',
      title: 'Desenha um 8',
      points: 30,
      explanation: [
        'O número 8 pode ser pensado como duas voltas. Para a primeira volta, a tartaruga roda numa direção. Para a segunda, roda na direção contrária.',
        'Este exercício mostra que mudar apenas uma instrução pode mudar muito o desenho final. [right] e [left] são parecidos, mas têm sentidos opostos.',
        'Também reforça a ideia de decompor um problema: em vez de “desenha um 8”, pensamos “desenha uma volta, depois desenha outra volta”.',
      ],
      instructions: [
        'Usa pelo menos um ciclo [for].',
        'Faz uma parte com [donatello.right].',
        'Faz outra parte com [donatello.left].',
        'Usa os controlos para mudar a linha sem perder a lógica do desenho.',
      ],
      observation: 'Deves ver duas voltas ligadas. A figura pode variar, mas tem de usar os dois sentidos de rotação.',
      hint: 'Divide o desenho em duas voltas: uma roda para a direita, a outra roda para a esquerda.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\n// desenha a primeira volta\n\n// desenha a segunda volta',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\nfor (let i = 0; i < 180; i++) {\n  donatello.forward(1);\n  donatello.right(2);\n}\n\nfor (let i = 0; i < 180; i++) {\n  donatello.forward(1);\n  donatello.left(2);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Oito</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      visualControls: [
        {
          label: 'Cor da linha',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'donatello\\.color\\("([^"]+)"\\);?',
          template: (value) => `donatello.color("${value}");`,
        },
        {
          label: 'Grossura da linha',
          type: 'range',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 4,
          pattern: 'donatello\\.width\\((\\d+)\\);?',
          template: (value) => `donatello.width(${value});`,
        },
      ],
      validate: (code, state) => {
        const moves = state.moves || [];

        const hasFor = /\bfor\s*\(/.test(code);
        const hasRight = moves.some((move) => move.type === 'right' && move.value > 0);
        const hasLeft = moves.some((move) => move.type === 'left' && move.value > 0);

        // Soma total de rotações à direita e à esquerda
        const totalRight = moves
          .filter((move) => move.type === 'right')
          .reduce((sum, move) => sum + move.value, 0);
        const totalLeft = moves
          .filter((move) => move.type === 'left')
          .reduce((sum, move) => sum + move.value, 0);

        // Cada volta precisa de ~360 graus, um 8 tem duas voltas
        // Tolerância de 10% para imprecisões
        const rightComplete = totalRight >= 324 && totalRight <= 396;
        const leftComplete = totalLeft >= 324 && totalLeft <= 396;

        return hasFor && hasRight && hasLeft && rightComplete && leftComplete;
      },
    },
    {
      id: 'donatello-oito-if',
      title: 'O 8 com um único ciclo',
      points: 35,
      explanation: [
        'Agora o desafio é fazer o 8 com um único ciclo. Para isso, o ciclo continua a repetir, mas lá dentro existe uma decisão.',
        'Durante a primeira metade das repetições, a tartaruga roda para um lado. Durante a segunda metade, roda para o outro. Essa escolha é feita com [if] e [else].',
        'Esta é uma ideia muito comum em programação: repetir muitas vezes, mas mudar o comportamento dependendo do momento ou do valor atual.',
      ],
      instructions: [
        'Usa apenas um ciclo [for].',
        'Dentro do ciclo, usa [if].',
        'Na primeira parte usa [right]; na segunda parte usa [left].',
        'Ajusta a cor e a grossura para veres que desenho e estilo são instruções diferentes.',
      ],
      observation: 'A validação procura um ciclo, uma decisão e muitos movimentos.',
      hint: 'Usa o valor de i para separar a primeira metade da segunda metade do ciclo.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\n// cria um único ciclo com uma decisão dentro',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\ndonatello.color("#2f5d78");\ndonatello.width(4);\n\nfor (let i = 0; i < 360; i++) {\n  donatello.forward(1);\n\n  if (i < 180) {\n    donatello.right(2);\n  } else {\n    donatello.left(2);\n  }\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Oito com decisão</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      visualControls: [
        {
          label: 'Cor da linha',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'donatello\\.color\\("([^"]+)"\\);?',
          template: (value) => `donatello.color("${value}");`,
        },
        {
          label: 'Grossura da linha',
          type: 'range',
          min: 1,
          max: 12,
          step: 1,
          defaultValue: 4,
          pattern: 'donatello\\.width\\((\\d+)\\);?',
          template: (value) => `donatello.width(${value});`,
        },
      ],
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          /\bif\s*\(/.test(code) &&
          moves.filter((move) => move.type === 'forward' && move.value > 0).length >= 250 &&
          moves.some((move) => move.type === 'right' && move.value > 0) &&
          moves.some((move) => move.type === 'left' && move.value > 0);
      },
    },
    {
      id: 'donatello-roomba',
      title: 'Donatello quer ser um Roomba',
      points: 30,
      explanation: [
        'Neste exercício, vamos programar o Donatello para se comportar como um aspirador Roomba!',
        'O algoritmo mais simples neste caso consiste em andar para a frente até encontrar uma parede. Se encontrar uma parede, volta atrás e escolhe outra direção.',
        'As paredes do quadrado delimitador estão nas posições [X = -100], [X = 100], [Y = -100] e [Y = 100]. Podes usar as funções [donatello.getX()] e [donatello.getY()] para ler a posição atual.',
      ],
      instructions: [
        'Gira o Donatello aleatoramente em cada passo com [donatello.right(numeroAleatorio(-5, 5))].',
        'Verifica se a sua posição [posX] ou [posY] sai dos limites do quadrado (entre -100 e 100).',
        'Se sair, anda 10 pixeis para trás ([donatello.forward(-10)]) e roda 180 graus ([donatello.right(180)]) para voltar para dentro.',
      ],
      observation: 'O Donatello deve andar de forma aleatória e manter-se sempre dentro do quadrado tracejado no ecrã.',
      hint: 'Dentro do ciclo, move-te com [donatello.forward(1)] em cada passo. Lê as posições com [donatello.getX()] e [donatello.getY()], e se saírem dos limites do quadrado, recua com [donatello.forward(-10)] e roda [donatello.right(180)].',
      starter: 'quadrado(donatello);\ndonatello.right(numeroAleatorio(0, 360));\n\nfor (let i = 0; i < 1200; i++) {\n  donatello.forward(1);\n\n  // 1. Obtém as coordenadas posX e posY do Donatello\n  const posX: number = donatello.getX();\n  const posY: number = donatello.getY();\n\n  // 2. Roda aleatoriamente entre -5 e 5 graus\n  donatello.right(numeroAleatorio(-5, 5));\n\n  // 3. Testa se posX ou posY saem do quadrado [-100, 100]\n  // Se sim, anda para trás (forward(-10)) e inverte a direção (right(180))\n}',
      solution: 'quadrado(donatello);\ndonatello.right(numeroAleatorio(0, 360));\n\nfor (let i = 0; i < 1200; i++) {\n  donatello.forward(1);\n\n  const posX: number = donatello.getX();\n  const posY: number = donatello.getY();\n\n  donatello.right(numeroAleatorio(-5, 5));\n\n  if (posX < -100 || posX > 100 || posY < -100 || posY > 100) {\n    donatello.forward(-10);\n    donatello.right(180);\n  }\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Donatello quer ser um Roomba</h2>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: () => donatelloApi() + `
        function quadrado(t) {
          window.exerciseState.isRoomba = true;
          t.position(260, 180);
          t.speed("rapido");
        }
        function numeroAleatorio(min, max) {
          const low = Math.ceil(Number(min));
          const high = Math.floor(Number(max));
          return Math.floor(Math.random() * (high - low + 1)) + low;
        }
      `,
      validate: (code, state) => {
        const moves = state.moves || [];
        const visited = state.visited || [];
        if (moves.length < 300) return false;
        if (!/getX/.test(code) || !/getY/.test(code)) return false;

        const escaped = visited.some(p => Math.abs(p.x) > 115 || Math.abs(p.y) > 115);
        if (escaped) return false;

        const reachedLeft = visited.some(p => p.x < -80);
        const reachedRight = visited.some(p => p.x > 80);
        const reachedTop = visited.some(p => p.y > 80);
        const reachedBottom = visited.some(p => p.y < -80);

        return reachedLeft && reachedRight && reachedTop && reachedBottom;
      },
    },
  ],
});
