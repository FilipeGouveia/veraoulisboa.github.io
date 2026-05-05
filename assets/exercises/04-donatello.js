window.exerciseTopics = window.exerciseTopics || [];

function donatelloApi() {
  return `
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let turtleDraw = { x: 190, y: 120, angle: 0 };
    let animationDelay = 14;
    const queuedMoves = [];
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#2f5d78';
    ctx.lineCap = 'round';
    window.exerciseState.moves = [];

    const donatello = {
      forward(distance) {
        const value = Number(distance);
        queuedMoves.push({ type: 'forward', value });
        window.exerciseState.moves.push({ type: 'forward', value });
      },
      right(angle) {
        const value = Number(angle);
        queuedMoves.push({ type: 'right', value });
        window.exerciseState.moves.push({ type: 'right', value });
      },
      left(angle) {
        const value = Number(angle);
        queuedMoves.push({ type: 'left', value });
        window.exerciseState.moves.push({ type: 'left', value });
      },
      position(x, y) {
        const nextX = Number(x);
        const nextY = Number(y);
        queuedMoves.push({ type: 'position', x: nextX, y: nextY });
        window.exerciseState.start = { x: nextX, y: nextY };
      },
      speed(mode) {
        const value = String(mode).toLowerCase();
        if (value === 'rapido' || value === 'rápido') animationDelay = 4;
        if (value === 'normal') animationDelay = 14;
        if (value === 'lento') animationDelay = 35;
        window.exerciseState.speed = value;
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

    window.playAnimation = async function playAnimation() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      turtleDraw = { x: 190, y: 120, angle: 0 };
      drawTurtle();
      await new Promise((resolve) => setTimeout(resolve, 160));
      ctx.strokeStyle = '#2f5d78';
      ctx.lineWidth = 4;

      for (const move of queuedMoves) {
        if (move.type === 'position') {
          turtleDraw.x = move.x;
          turtleDraw.y = move.y;
          drawTurtle();
        }
        if (move.type === 'right') turtleDraw.angle += move.value;
        if (move.type === 'left') turtleDraw.angle -= move.value;
        if (move.type === 'forward') {
          const start = { ...turtleDraw };
          const radians = turtleDraw.angle * Math.PI / 180;
          const end = {
            x: turtleDraw.x + Math.cos(radians) * move.value,
            y: turtleDraw.y + Math.sin(radians) * move.value,
          };
          const frames = Math.max(8, Math.min(40, Math.ceil(Math.abs(move.value) / 5)));
          for (let frame = 1; frame <= frames; frame++) {
            const t = frame / frames;
            turtleDraw.x = start.x + (end.x - start.x) * t;
            turtleDraw.y = start.y + (end.y - start.y) * t;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(turtleDraw.x, turtleDraw.y);
            ctx.stroke();
            drawTurtle();
            await new Promise((resolve) => setTimeout(resolve, animationDelay));
          }
          turtleDraw = { ...end, angle: turtleDraw.angle };
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
        'Usa um ciclo for para repetir 4 vezes.',
        'Em cada repetição, anda 120 pixeis.',
        'Depois roda 90 graus.',
        'Se quiseres, muda a posição inicial com donatello.position(x, y).',
        'Experimenta donatello.speed("lento"), "normal" ou "rapido".',
      ],
      observation: 'A figura deve formar quatro lados iguais. A animação mostra a ordem das instruções.',
      hint: 'Para um quadrado, repete quatro vezes: anda um lado, depois vira um canto de 90 graus.',
      starter: 'donatello.speed("normal");\ndonatello.position(190, 120);\n\n// cria o ciclo do quadrado aqui',
      solution: 'donatello.speed("rapido");\ndonatello.position(190, 120);\n\nfor (let i = 0; i < 4; i++) {\n  donatello.forward(120);\n  donatello.right(90);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Donatello</h1>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
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
        'Usa um ciclo for com 360 repetições.',
        'Em cada volta, anda 1 pixel.',
        'Em cada volta, roda 1 grau.',
      ],
      observation: 'A circunferência pode não ficar matematicamente perfeita, mas deve parecer uma volta fechada.',
      hint: 'Uma volta completa tem 360 graus. Podes fazer muitos passos pequenos, rodando um pouco em cada passo.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\n// cria o ciclo da circunferência aqui',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\nfor (let i = 0; i < 360; i++) {\n  donatello.forward(1);\n  donatello.right(1);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Circunferência</h1>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          moves.filter((move) => move.type === 'forward' && move.value === 1).length >= 300 &&
          moves.filter((move) => ['right', 'left'].includes(move.type) && Math.abs(move.value) === 1).length >= 300;
      },
    },
    {
      id: 'donatello-oito',
      title: 'Desenha um 8',
      points: 25,
      explanation: [
        'O número 8 pode ser pensado como duas voltas. Para a primeira volta, a tartaruga roda numa direção. Para a segunda, roda na direção contrária.',
        'Este exercício mostra que mudar apenas uma instrução pode mudar muito o desenho final. right e left são parecidos, mas têm sentidos opostos.',
        'Também reforça a ideia de decompor um problema: em vez de “desenha um 8”, pensamos “desenha uma volta, depois desenha outra volta”.',
      ],
      instructions: [
        'Usa pelo menos um ciclo for.',
        'Faz uma parte com donatello.right.',
        'Faz outra parte com donatello.left.',
      ],
      observation: 'Deves ver duas voltas ligadas. A figura pode variar, mas tem de usar os dois sentidos de rotação.',
      hint: 'Divide o desenho em duas voltas: uma roda para a direita, a outra roda para a esquerda.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\n// desenha a primeira volta\n\n// desenha a segunda volta',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\nfor (let i = 0; i < 180; i++) {\n  donatello.forward(1);\n  donatello.right(2);\n}\n\nfor (let i = 0; i < 180; i++) {\n  donatello.forward(1);\n  donatello.left(2);\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Oito</h1>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          moves.some((move) => move.type === 'right' && move.value > 0) &&
          moves.some((move) => move.type === 'left' && move.value > 0) &&
          moves.filter((move) => move.type === 'forward' && move.value > 0).length >= 250;
      },
    },
    {
      id: 'donatello-oito-if',
      title: 'O 8 com um único ciclo',
      points: 30,
      explanation: [
        'Agora o desafio é fazer o 8 com um único ciclo. Para isso, o ciclo continua a repetir, mas lá dentro existe uma decisão.',
        'Durante a primeira metade das repetições, a tartaruga roda para um lado. Durante a segunda metade, roda para o outro. Essa escolha é feita com if e else.',
        'Esta é uma ideia muito comum em programação: repetir muitas vezes, mas mudar o comportamento dependendo do momento ou do valor atual.',
      ],
      instructions: [
        'Usa apenas um ciclo for.',
        'Dentro do ciclo, usa if.',
        'Na primeira parte usa right; na segunda parte usa left.',
      ],
      observation: 'A validação procura um ciclo, uma decisão e muitos movimentos.',
      hint: 'Usa o valor de i para separar a primeira metade da segunda metade do ciclo.',
      starter: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\n// cria um único ciclo com uma decisão dentro',
      solution: 'donatello.speed("rapido");\ndonatello.position(250, 180);\n\nfor (let i = 0; i < 360; i++) {\n  donatello.forward(1);\n\n  if (i < 180) {\n    donatello.right(2);\n  } else {\n    donatello.left(2);\n  }\n}',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Oito com decisão</h1>
            <canvas id="canvas" width="520" height="360"></canvas>
          </section>
        </main>
      `,
      api: donatelloApi,
      validate: (code, state) => {
        const moves = state.moves || [];
        return /\bfor\s*\(/.test(code) &&
          /\bif\s*\(/.test(code) &&
          moves.filter((move) => move.type === 'forward' && move.value > 0).length >= 250 &&
          moves.some((move) => move.type === 'right' && move.value > 0) &&
          moves.some((move) => move.type === 'left' && move.value > 0);
      },
    },
  ],
});
