window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'desafios',
  title: 'Desafios de Programação',
  exercises: [
    // ─── Challenge 1: O Desafio do Arquiteto ───────────────────────────────
    {
      id: 'arquiteto',
      advanced: [
        'Comparar todos os pares com dois ciclos [for] aninhados faz cerca de n²/2 comparações, que cresce depressa com muitos pontos. Pôr [j] a começar em [i+1] evita repetir pares e comparar um ponto consigo próprio. [Math.hypot] é o teorema de Pitágoras aplicado às diferenças de coordenadas.',
      ],
      title: 'O Desafio do Arquiteto',
      points: 50,
      interactive: true,
      terminal: true,
      explanation: [
        'Neste desafio és um arquiteto urbanista. Tens vários pontos de interesse numa cidade (hospitais, escolas, estações de metro) e precisas de analisar as distâncias entre eles.',
        'O programa pede o número de pontos e as coordenadas (x, y) de cada um. Depois calcula a distância entre todos os pares possíveis e encontra a menor e a maior distância.',
        'A distância entre dois pontos usa a fórmula de Pitágoras: [Math.hypot(x2 - x1, y2 - y1)]. Para todos os pares usa dois ciclos [for] aninhados com [j > i] para não repetir pares.',
      ],
      instructions: [
        'Este é um desafio: o editor começa quase vazio e constróis o programa todo a partir das dicas.',
        'Dica 1: pede o número de pontos com [const n: number = Number(await lerInput("Número de pontos:"));].',
        'Dica 2: usa um ciclo [for] de [0] a [n] para pedir o [x] e o [y] de cada ponto (lembra-te do [Number()]).',
        'Dica 3: dentro do ciclo, guarda cada ponto (ex.: [pontos.push([x, y]);]) e chama [adicionarPonto(x, y)] para o desenhar no mapa.',
        'Dica 4: para comparar todos os pares sem repetir, usa dois ciclos [for] aninhados com [j] a começar em [i + 1].',
        'Dica 5: a distância entre dois pontos é [Math.hypot(x2 - x1, y2 - y1)].',
        'Dica 6: guarda o mínimo (começa em [Infinity]) e o máximo (começa em [0]) e actualiza-os com [if].',
        'Dica 7: no fim, mostra os valores com [escrever()] e chama [mostrarDistancias(minDist, maxDist)].',
      ],
      observation: 'Para 3 pontos (0,0), (3,4) e (10,10): menor distância = 5, maior distância ≈ 14.14.',
      hint: 'Estrutura sugerida: (1) pede n; (2) ciclo for para ler e desenhar cada ponto com adicionarPonto; (3) dois ciclos for aninhados (i, e j a começar em i+1) para cada par; (4) Math.hypot para a distância; (5) compara com minDist/maxDist. Arranca minDist em Infinity e maxDist em 0.',
      starter: '// Desafio do Arquiteto — começa do zero, seguindo as dicas do lado esquerdo.\n// Funções disponíveis: await lerInput("..."), adicionarPonto(x, y),\n// Math.hypot(dx, dy), escrever("..."), mostrarDistancias(min, max).\n\n// 1. Pede o número de pontos\n\n// 2. Lê cada ponto e mostra-o com adicionarPonto\n\n// 3. Percorre todos os pares e guarda a menor e a maior distância\n\n// 4. Mostra os resultados',
      solution: 'const n: number = Number(await lerInput("Número de pontos:"));\nconst pontos: number[][] = [];\n\nfor (let i = 0; i < n; i++) {\n  const x: number = Number(await lerInput("Ponto " + (i+1) + " - x:"));\n  const y: number = Number(await lerInput("Ponto " + (i+1) + " - y:"));\n  pontos.push([x, y]);\n  adicionarPonto(x, y);\n}\n\nlet minDist: number = Infinity;\nlet maxDist: number = 0;\n\nfor (let i = 0; i < pontos.length; i++) {\n  for (let j = i + 1; j < pontos.length; j++) {\n    const dist: number = Math.hypot(pontos[j][0] - pontos[i][0], pontos[j][1] - pontos[i][1]);\n    if (dist < minDist) minDist = dist;\n    if (dist > maxDist) maxDist = dist;\n  }\n}\n\nescrever("Maior distância: " + maxDist);\nescrever("Menor distância: " + minDist);\nmostrarDistancias(minDist, maxDist);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>🏙️ Mapa da Cidade</h2>
            <canvas id="canvas" width="520" height="240"></canvas>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;font-weight:700;font-size:14px;">
              <div>🔵 Menor: <span id="min-dist" style="color:#0077b6">—</span></div>
              <div>🟠 Maior: <span id="max-dist" style="color:#d97706">—</span></div>
            </div>
          </section>
        </main>
      `,
      api: `
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const rawPoints = [];
        window.exerciseState.points = [];
        window.exerciseState.minDist = null;
        window.exerciseState.maxDist = null;

        function drawMap() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const xs = rawPoints.map((p) => p[0]);
          const ys = rawPoints.map((p) => p[1]);
          const minX = rawPoints.length ? Math.min(...xs) : 0;
          const maxX = rawPoints.length ? Math.max(...xs) : 10;
          const minY = rawPoints.length ? Math.min(...ys) : 0;
          const maxY = rawPoints.length ? Math.max(...ys) : 10;
          const pad = 36;
          const rangeX = maxX - minX || 1;
          const rangeY = maxY - minY || 1;
          function toC(x, y) {
            return [
              pad + ((x - minX) / rangeX) * (canvas.width - pad * 2),
              canvas.height - pad - ((y - minY) / rangeY) * (canvas.height - pad * 2),
            ];
          }
          ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const gx = pad + i * (canvas.width - pad*2) / 4;
            ctx.beginPath(); ctx.moveTo(gx, pad); ctx.lineTo(gx, canvas.height - pad); ctx.stroke();
            const gy = pad + i * (canvas.height - pad*2) / 4;
            ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(canvas.width - pad, gy); ctx.stroke();
          }
          if (rawPoints.length === 0) return;
          ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
          for (let i = 0; i < rawPoints.length; i++) {
            for (let j = i + 1; j < rawPoints.length; j++) {
              const [x1, y1] = toC(rawPoints[i][0], rawPoints[i][1]);
              const [x2, y2] = toC(rawPoints[j][0], rawPoints[j][1]);
              ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            }
          }
          rawPoints.forEach((p, idx) => {
            const [cx, cy] = toC(p[0], p[1]);
            ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI * 2);
            ctx.fillStyle = '#0077b6'; ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(idx + 1, cx, cy);
          });
        }
        drawMap();

        function adicionarPonto(x, y) {
          rawPoints.push([Number(x), Number(y)]);
          window.exerciseState.points.push({ x: Number(x), y: Number(y) });
          drawMap();
        }

        function mostrarDistancias(min, max) {
          const minVal = Number(min), maxVal = Number(max);
          window.exerciseState.minDist = minVal;
          window.exerciseState.maxDist = maxVal;
          const minEl = document.getElementById('min-dist');
          const maxEl = document.getElementById('max-dist');
          if (minEl) minEl.textContent = Number.isFinite(minVal) ? minVal.toFixed(6) : '—';
          if (maxEl) maxEl.textContent = Number.isFinite(maxVal) ? maxVal.toFixed(6) : '—';
        }
      `,
      validate: (code, state) => {
        const pts = state.points || [];
        if (pts.length < 2) return false;
        if (state.minDist === null || state.maxDist === null) return false;
        let expectedMin = Infinity, expectedMax = 0;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y);
            if (d < expectedMin) expectedMin = d;
            if (d > expectedMax) expectedMax = d;
          }
        }
        return (
          /lerInput/.test(code) &&
          /for\s*\(/.test(code) &&
          /(Math\.hypot|Math\.sqrt)/.test(code) &&
          Math.abs(state.minDist - expectedMin) < 0.001 &&
          Math.abs(state.maxDist - expectedMax) < 0.001
        );
      },
    },

    // ─── Challenge 2: Melhor Jogador de Futebol ────────────────────────────
    {
      id: 'mvp-futebol',
      advanced: [
        'Encontrar o máximo percorrendo a lista uma vez e guardando o melhor até agora é um padrão fundamental (varrimento linear). Começar [melhorPontos] em [-Infinity] garante que o primeiro jogador é sempre aceite, mesmo com pontuações negativas.',
      ],
      title: 'Melhor Jogador de Futebol',
      points: 45,
      interactive: true,
      terminal: true,
      explanation: [
        'Neste desafio és um olheiro de elite. O teu trabalho é analisar as estatísticas de vários jogadores e encontrar o MVP (Most Valuable Player) da temporada.',
        'Cada jogador tem um score calculado por uma fórmula: golos × 5 + assistências × 3 + desarmes × 1 + faltas × (−2).',
        'O programa pede os dados de n jogadores e no final anuncia quem tem o score mais alto.',
      ],
      instructions: [
        'Este é um desafio: o editor começa quase vazio e constróis o programa todo a partir das dicas.',
        'Dica 1: pede o número de jogadores com [const n: number = Number(await lerInput("Número de jogadores:"));].',
        'Dica 2: antes do ciclo, cria [let melhorNome: string = "";] e [let melhorPontos: number = -Infinity;].',
        'Dica 3: usa um ciclo [for] de [0] a [n]; dentro dele pede nome, golos, assistências, desarmes e faltas com [lerInput] (converte os números com [Number()]).',
        'Dica 4: calcula o score com [golos * 5 + assistencias * 3 + desarmes * 1 + faltas * (-2)].',
        'Dica 5: regista o jogador com [adicionarJogador(nome, golos, assistencias, desarmes, faltas, score)].',
        'Dica 6: se [score > melhorPontos], actualiza [melhorPontos] e [melhorNome].',
        'Dica 7: no fim, mostra o resultado com [escrever()] e chama [anunciarVencedor(melhorNome, melhorPontos)].',
      ],
      observation: 'Cristiano (13 golos, 4 ast, 5 des, 2 faltas): 13×5+4×3+5−4 = 78 pts.',
      hint: 'Arranca com melhorPontos = -Infinity e melhorNome = "". Dentro do ciclo: pede os dados, calcula score = golos*5 + assistencias*3 + desarmes*1 + faltas*(-2), regista com adicionarJogador, e se score > melhorPontos guarda o novo melhor. No fim, anunciarVencedor(melhorNome, melhorPontos).',
      starter: '// Melhor Jogador de Futebol — constrói o programa a partir das dicas do lado esquerdo.\n// Funções disponíveis: await lerInput("..."), Number(...),\n// adicionarJogador(nome, golos, assistencias, desarmes, faltas, score),\n// escrever("..."), anunciarVencedor(nome, pontos).\n\n// 1. Pede o número de jogadores\n\n// 2. Para cada jogador, pede nome, golos, assistências, desarmes e faltas\n\n// 3. Calcula o score e regista o jogador com adicionarJogador\n\n// 4. Guarda o melhor e anuncia o vencedor',
      solution: 'const n: number = Number(await lerInput("Número de jogadores:"));\n\nlet melhorNome: string = "";\nlet melhorPontos: number = -Infinity;\n\nfor (let i = 0; i < n; i++) {\n  const nome: string = await lerInput("Nome do jogador " + (i+1) + ":");\n  const golos: number = Number(await lerInput("Golos:"));\n  const assistencias: number = Number(await lerInput("Assistências:"));\n  const desarmes: number = Number(await lerInput("Desarmes:"));\n  const faltas: number = Number(await lerInput("Faltas:"));\n\n  const score: number = golos * 5 + assistencias * 3 + desarmes * 1 + faltas * (-2);\n\n  adicionarJogador(nome, golos, assistencias, desarmes, faltas, score);\n  escrever(nome + ": " + score + " pontos");\n\n  if (score > melhorPontos) {\n    melhorPontos = score;\n    melhorNome = nome;\n  }\n}\n\nescrever("Melhor jogador: " + melhorNome + " com " + melhorPontos + " pontos");\nanunciarVencedor(melhorNome, melhorPontos);',
      html: `
        <main class="stage">
          <section class="panel dark">
            <h2>⚽ Análise MVP</h2>
            <ul class="grid-list" id="player-list" style="flex-direction:column;gap:6px;"></ul>
            <p id="vencedor" style="margin-top:16px;font-size:18px;font-weight:800;color:#fbbf24;min-height:1.4em;">Ainda não calculado.</p>
          </section>
        </main>
      `,
      api: `
        const playerList = document.getElementById('player-list');
        window.exerciseState.jogadores = [];
        window.exerciseState.vencedor = null;
        window.exerciseState.maxScore = null;

        function adicionarJogador(nome, golos, assistencias, desarmes, faltas, score) {
          const n = String(nome), sc = Number(score);
          window.exerciseState.jogadores.push({ nome: n, score: sc });
          const li = document.createElement('li');
          li.id = 'player-' + window.exerciseState.jogadores.length;
          li.style.cssText = 'display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:9px 14px;border-radius:8px;background:#1e3a4f;width:100%;';
          li.innerHTML =
            '<span style="font-weight:700;color:#e2e8f0;font-size:14px;">' + n +
            '<small style="display:block;font-weight:400;color:#94a3b8;font-size:12px;">⚽ ' + golos + '  🎯 ' + assistencias + '  🛡 ' + desarmes + '  ⚠ ' + faltas + '</small></span>' +
            '<span style="font-size:20px;font-weight:800;color:#60a5fa;">' + sc + '</span>';
          playerList.appendChild(li);
        }

        function anunciarVencedor(nome, pontos) {
          const n = String(nome), sc = Number(pontos);
          window.exerciseState.vencedor = n;
          window.exerciseState.maxScore = sc;
          const jogadores = window.exerciseState.jogadores;
          for (let i = 0; i < jogadores.length; i++) {
            const el = document.getElementById('player-' + (i + 1));
            if (el && jogadores[i].nome === n && jogadores[i].score === sc) {
              el.style.background = '#14532d';
              el.style.outline = '2px solid #22c55e';
              el.querySelector('span:last-child').style.color = '#4ade80';
            }
          }
          const el = document.getElementById('vencedor');
          if (el) el.textContent = '🏆 ' + n + ' — ' + sc + ' pontos!';
        }
      `,
      validate: (code, state) => {
        const jogadores = state.jogadores || [];
        if (jogadores.length < 2) return false;
        if (!state.vencedor || state.maxScore === null) return false;
        const expectedMax = Math.max(...jogadores.map((j) => j.score));
        return (
          /lerInput/.test(code) &&
          /for\s*\(/.test(code) &&
          /\*\s*5/.test(code) &&
          /\*\s*3/.test(code) &&
          /\*.*-?\s*2|-2\s*\*/.test(code) &&
          Math.abs(state.maxScore - expectedMax) < 0.001
        );
      },
    },
  ],
});
