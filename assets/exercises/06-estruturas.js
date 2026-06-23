window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'estruturas',
  title: 'Grafos, Árvores e Procura',
  exercises: [
    {
      id: 'grafo-criar',
      advanced: [
        'Um grafo é uma das estruturas mais usadas em informática: redes sociais, mapas, dependências entre tarefas. Aqui guardamos nós e arestas em listas; a física do desenho é só uma forma de os ver — a estrutura são as ligações.',
      ],
      title: 'Ligar pontos',
      points: 20,
      explanation: [
        'Um grafo é uma forma de representar objetos ligados entre si. Os objetos são nós; as ligações são arestas.',
        'Pensa num mapa: as cidades são nós e as estradas são arestas. Numa rede social, as pessoas são nós e as amizades são arestas.',
        'Neste exercício vais criar nós com posições no ecrã e depois criar ligações entre eles. O objetivo é perceber que a estrutura do problema pode ser desenhada.',
      ],
      instructions: [
        'Cria pelo menos 4 nós com [adicionarNo].',
        'Cria pelo menos 3 ligações com [ligar].',
        'Observa como as arestas unem os nós.',
        'Arrasta um nó e repara como os outros se ajustam com a física do grafo.',
        'Muda a cor e o tamanho dos nós para veres a representação gráfica mudar no código.',
      ],
      observation: 'O grafo deve ter vários pontos ligados. A posição x controla a horizontal; y controla a vertical, mas a física ajusta ligeiramente o desenho.',
      hint: 'Cria primeiro todos os nós. Depois liga pares de nós pelos nomes que escolheste.',
      starter: 'adicionarNo("A", 120, 90);\nadicionarNo("B", 300, 90);\n\nligar("A", "B");\n\nmudarCorNos("#2f5d78");\nmudarTamanhoNos(54);',
      solution: 'adicionarNo("A", 120, 90);\nadicionarNo("B", 300, 90);\nadicionarNo("C", 210, 210);\nadicionarNo("D", 390, 220);\n\nligar("A", "B");\nligar("A", "C");\nligar("C", "D");\n\nmudarCorNos("#2f5d78");\nmudarTamanhoNos(54);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Grafo</h2>
            <div class="graph-area" id="graph"></div>
          </section>
        </main>
      `,
      api: `
        const graph = document.getElementById('graph');
        const nodes = {};
        const edges = [];
        let physicsStarted = false;
        window.exerciseState.nodes = [];
        window.exerciseState.edges = [];
        function drawEdge(a, b) {
          const start = nodes[a];
          const end = nodes[b];
          if (!start || !end) return;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const edge = document.createElement('div');
          edge.className = 'edge';
          edge.style.left = start.x + 'px';
          edge.style.top = start.y + 'px';
          edge.style.width = Math.hypot(dx, dy) + 'px';
          edge.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
          graph.prepend(edge);
        }
        function redrawEdges() {
          graph.querySelectorAll('.edge').forEach((edge) => edge.remove());
          edges.forEach(([a, b]) => drawEdge(a, b));
        }
        function updateNode(nome) {
          const data = nodes[nome];
          if (!data?.el) return;
          data.el.style.left = data.x + 'px';
          data.el.style.top = data.y + 'px';
        }
        function keepInside(data) {
          const rect = graph.getBoundingClientRect();
          data.x = Math.max(28, Math.min(rect.width - 28, data.x));
          data.y = Math.max(28, Math.min(rect.height - 28, data.y));
        }
        function startPhysics() {
          if (physicsStarted) return;
          physicsStarted = true;
          function tick() {
            const names = Object.keys(nodes);
            for (let i = 0; i < names.length; i++) {
              for (let j = i + 1; j < names.length; j++) {
                const a = nodes[names[i]];
                const b = nodes[names[j]];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.max(35, Math.hypot(dx, dy));
                const force = 900 / (distance * distance);
                const fx = dx / distance * force;
                const fy = dy / distance * force;
                if (!a.fixed) { a.vx -= fx; a.vy -= fy; }
                if (!b.fixed) { b.vx += fx; b.vy += fy; }
              }
            }
            edges.forEach(([aName, bName]) => {
              const a = nodes[aName];
              const b = nodes[bName];
              if (!a || !b) return;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.max(1, Math.hypot(dx, dy));
              const pull = (distance - 145) * 0.004;
              const fx = dx / distance * pull;
              const fy = dy / distance * pull;
              if (!a.fixed) { a.vx += fx; a.vy += fy; }
              if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
            });
            names.forEach((nome) => {
              const data = nodes[nome];
              if (!data.fixed) {
                data.vx *= 0.86;
                data.vy *= 0.86;
                data.x += data.vx;
                data.y += data.vy;
                keepInside(data);
                updateNode(nome);
              }
            });
            redrawEdges();
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        function enableDrag(node, nome) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            nodes[nome].fixed = true;
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = graph.getBoundingClientRect();
            nodes[nome].x = Math.max(28, Math.min(rect.width - 28, event.clientX - rect.left));
            nodes[nome].y = Math.max(28, Math.min(rect.height - 28, event.clientY - rect.top));
            nodes[nome].vx = 0;
            nodes[nome].vy = 0;
            updateNode(nome);
            redrawEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            nodes[nome].fixed = false;
            node.style.cursor = 'grab';
          });
        }
        function adicionarNo(nome, x, y) {
          nodes[nome] = { x: Number(x), y: Number(y), vx: 0, vy: 0, fixed: false };
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'node-' + nome;
          node.style.left = Number(x) + 'px';
          node.style.top = Number(y) + 'px';
          node.textContent = nome;
          graph.appendChild(node);
          nodes[nome].el = node;
          enableDrag(node, nome);
          window.exerciseState.nodes.push(nome);
          startPhysics();
        }
        function ligar(a, b) {
          edges.push([a, b]);
          drawEdge(a, b);
          window.exerciseState.edges.push([a, b]);
          startPhysics();
        }
        function mudarCorNos(cor) {
          document.querySelectorAll('.node').forEach((node) => node.style.background = String(cor));
          window.exerciseState.nodeColor = String(cor);
        }
        function mudarTamanhoNos(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('.node').forEach((node) => {
            node.style.width = size + 'px';
            node.style.height = size + 'px';
          });
          window.exerciseState.nodeSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor dos nós',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'mudarCorNos\\("([^"]+)"\\);?',
          template: (value) => `mudarCorNos("${value}");`,
        },
        {
          label: 'Tamanho dos nós',
          type: 'range',
          min: 36,
          max: 82,
          step: 2,
          defaultValue: 54,
          pattern: 'mudarTamanhoNos\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoNos(${value});`,
        },
      ],
      validate: (code, state) => (state.nodes || []).length >= 4 && (state.edges || []).length >= 3,
    },
    {
      id: 'grafo-caminho',
      advanced: [
        'Um caminho é uma lista ordenada de nós, e a ordem distingue um caminho de outro. Encontrar caminhos é o problema que algoritmos como a procura em largura (BFS) ou o Dijkstra resolvem em grafos maiores.',
      ],
      title: 'Mostrar um caminho',
      points: 20,
      explanation: [
        'Depois de desenharmos um grafo, podemos fazer perguntas sobre ele. Uma pergunta comum é: por que caminho posso ir de um ponto a outro?',
        'Um caminho é uma lista de nós por ordem. Por exemplo, ["A", "C", "D"] significa: começa em A, passa por C e termina em D.',
        'Repara que uma lista aqui não é só um conjunto de coisas. A ordem importa. Trocar a ordem pode significar outro caminho.',
      ],
      instructions: [
        'Chama [criarMapa] para desenhar o grafo inicial.',
        'Usa [marcarCaminho] com a lista ["A", "C", "D"].',
        'A ordem dos nós importa: o caminho deve ir do início ([A]) até ao fim ([D]) — ["A", "D", "C"] seria um caminho diferente.',
        'Arrasta os nós para veres o caminho acompanhar a física do grafo.',
        'Ajusta a cor dos nós e o tamanho do destaque para comparar dados e visualização.',
      ],
      observation: 'Os nós do caminho devem ficar destacados.',
      hint: 'Um caminho é uma lista ordenada de nomes. A ordem deve ir do início até ao destino.',
      starter: 'criarMapa();\nmarcarCaminho([]);\nmudarCorNos("#2f5d78");\nmudarTamanhoNos(54);',
      solution: 'criarMapa();\nmarcarCaminho(["A", "C", "D"]);\nmudarCorNos("#2f5d78");\nmudarTamanhoNos(54);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Caminho</h2>
            <div class="graph-area" id="graph"></div>
          </section>
        </main>
      `,
      api: `
        const graph = document.getElementById('graph');
        const nodes = {};
        const edges = [];
        let physicsStarted = false;
        window.exerciseState.path = [];
        function drawEdge(a, b) {
          const start = nodes[a];
          const end = nodes[b];
          if (!start || !end) return;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const line = document.createElement('div');
          line.className = 'edge';
          line.style.left = start.x + 'px';
          line.style.top = start.y + 'px';
          line.style.width = Math.hypot(dx, dy) + 'px';
          line.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
          graph.prepend(line);
        }
        function redrawEdges() {
          graph.querySelectorAll('.edge').forEach((edge) => edge.remove());
          edges.forEach(([a, b]) => drawEdge(a, b));
        }
        function updateNode(nome) {
          const data = nodes[nome];
          if (!data?.el) return;
          data.el.style.left = data.x + 'px';
          data.el.style.top = data.y + 'px';
        }
        function keepInside(data) {
          const rect = graph.getBoundingClientRect();
          data.x = Math.max(28, Math.min(rect.width - 28, data.x));
          data.y = Math.max(28, Math.min(rect.height - 28, data.y));
        }
        function startPhysics() {
          if (physicsStarted) return;
          physicsStarted = true;
          function tick() {
            const names = Object.keys(nodes);
            for (let i = 0; i < names.length; i++) {
              for (let j = i + 1; j < names.length; j++) {
                const a = nodes[names[i]];
                const b = nodes[names[j]];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.max(35, Math.hypot(dx, dy));
                const force = 850 / (distance * distance);
                const fx = dx / distance * force;
                const fy = dy / distance * force;
                if (!a.fixed) { a.vx -= fx; a.vy -= fy; }
                if (!b.fixed) { b.vx += fx; b.vy += fy; }
              }
            }
            edges.forEach(([aName, bName]) => {
              const a = nodes[aName];
              const b = nodes[bName];
              if (!a || !b) return;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.max(1, Math.hypot(dx, dy));
              const pull = (distance - 145) * 0.004;
              const fx = dx / distance * pull;
              const fy = dy / distance * pull;
              if (!a.fixed) { a.vx += fx; a.vy += fy; }
              if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
            });
            names.forEach((nome) => {
              const data = nodes[nome];
              if (!data.fixed) {
                data.vx *= 0.86;
                data.vy *= 0.86;
                data.x += data.vx;
                data.y += data.vy;
                keepInside(data);
                updateNode(nome);
              }
            });
            redrawEdges();
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        function enableDrag(node, nome) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            nodes[nome].fixed = true;
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = graph.getBoundingClientRect();
            nodes[nome].x = Math.max(28, Math.min(rect.width - 28, event.clientX - rect.left));
            nodes[nome].y = Math.max(28, Math.min(rect.height - 28, event.clientY - rect.top));
            nodes[nome].vx = 0;
            nodes[nome].vy = 0;
            updateNode(nome);
            redrawEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            nodes[nome].fixed = false;
            node.style.cursor = 'grab';
          });
        }
        function add(nome, x, y) {
          nodes[nome] = { x, y, vx: 0, vy: 0, fixed: false };
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'node-' + nome;
          node.style.left = x + 'px';
          node.style.top = y + 'px';
          node.textContent = nome;
          graph.appendChild(node);
          nodes[nome].el = node;
          enableDrag(node, nome);
          startPhysics();
        }
        function edge(a, b) {
          edges.push([a, b]);
          drawEdge(a, b);
          startPhysics();
        }
        function criarMapa() {
          add('A', 110, 100); add('B', 280, 80); add('C', 190, 220); add('D', 390, 220);
          edge('A', 'B'); edge('A', 'C'); edge('B', 'D'); edge('C', 'D');
        }
        function marcarCaminho(caminho) {
          window.exerciseState.path = caminho;
          caminho.forEach((nome) => document.getElementById('node-' + nome)?.classList.add('active'));
        }
        function mudarCorNos(cor) {
          document.querySelectorAll('.node:not(.active)').forEach((node) => node.style.background = String(cor));
          window.exerciseState.nodeColor = String(cor);
        }
        function mudarTamanhoNos(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('.node').forEach((node) => {
            node.style.width = size + 'px';
            node.style.height = size + 'px';
          });
          window.exerciseState.nodeSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Cor dos nós',
          type: 'color',
          defaultValue: '#2f5d78',
          pattern: 'mudarCorNos\\("([^"]+)"\\);?',
          template: (value) => `mudarCorNos("${value}");`,
        },
        {
          label: 'Tamanho dos nós',
          type: 'range',
          min: 36,
          max: 82,
          step: 2,
          defaultValue: 54,
          pattern: 'mudarTamanhoNos\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoNos(${value});`,
        },
      ],
      validate: (code, state) => JSON.stringify(state.path) === JSON.stringify(['A', 'C', 'D']),
    },
    {
      id: 'rede-pesos',
      advanced: [
        'Dar um peso a cada nó é uma forma de modelar importância. Em grafos a sério, os pesos costumam estar nas arestas (distâncias, custos) e são a base para encontrar o caminho mais curto ou a ligação mais barata.',
      ],
      title: 'Rede com pesos',
      points: 30,
      explanation: [
        'Nem todos os nós de uma rede precisam de ter a mesma importância. Numa rede social, uma pessoa com muitas ligações pode puxar mais atenção. Num mapa, uma cidade maior pode ter mais influência.',
        'Neste exercício, cada nó tem um peso. Quanto maior o peso, maior fica o nó e mais força ele exerce sobre os outros nós da rede.',
        'A física do grafo ajuda a ver esta ideia: os nós ligados aproximam-se, os nós pesados puxam mais, e a rede encontra uma forma equilibrada.',
      ],
      instructions: [
        'Cria pelo menos 4 nós com [adicionarNo(nome, peso, x, y)].',
        'Usa pesos diferentes, por exemplo 1, 3, 5 e 8.',
        'Cria pelo menos 3 ligações com [ligar].',
        'Arrasta os nós para sentires como os pesos mudam o movimento da rede.',
      ],
      observation: 'Nós com peso maior aparecem maiores e puxam os outros com mais força.',
      hint: 'Começa por criar os nós. Depois liga alguns pares. Experimenta aumentar um peso e executa de novo para ver a rede reorganizar-se.',
      starter: 'adicionarNo("Sol", 8, 250, 160);\nadicionarNo("A", 2, 110, 100);\nadicionarNo("B", 3, 390, 110);\n\n// adiciona mais nós e ligações aqui',
      solution: 'adicionarNo("Sol", 8, 250, 160);\nadicionarNo("A", 2, 110, 100);\nadicionarNo("B", 3, 390, 110);\nadicionarNo("C", 5, 210, 260);\nadicionarNo("D", 1, 420, 250);\n\nligar("Sol", "A");\nligar("Sol", "B");\nligar("Sol", "C");\nligar("C", "D");',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Rede com pesos</h2>
            <div class="graph-area" id="graph"></div>
          </section>
        </main>
      `,
      api: `
        const graph = document.getElementById('graph');
        const nodes = {};
        const edges = [];
        let physicsStarted = false;
        window.exerciseState.nodes = [];
        window.exerciseState.edges = [];
        function drawEdge(a, b) {
          const start = nodes[a];
          const end = nodes[b];
          if (!start || !end) return;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const edge = document.createElement('div');
          edge.className = 'edge';
          edge.style.left = start.x + 'px';
          edge.style.top = start.y + 'px';
          edge.style.width = Math.hypot(dx, dy) + 'px';
          edge.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
          graph.prepend(edge);
        }
        function redrawEdges() {
          graph.querySelectorAll('.edge').forEach((edge) => edge.remove());
          edges.forEach(([a, b]) => drawEdge(a, b));
        }
        function updateNode(nome) {
          const data = nodes[nome];
          if (!data?.el) return;
          data.el.style.left = data.x + 'px';
          data.el.style.top = data.y + 'px';
        }
        function keepInside(data) {
          const rect = graph.getBoundingClientRect();
          const radius = Math.max(24, data.size / 2);
          data.x = Math.max(radius, Math.min(rect.width - radius, data.x));
          data.y = Math.max(radius, Math.min(rect.height - radius, data.y));
        }
        function startPhysics() {
          if (physicsStarted) return;
          physicsStarted = true;
          function tick() {
            const names = Object.keys(nodes);
            for (let i = 0; i < names.length; i++) {
              for (let j = i + 1; j < names.length; j++) {
                const a = nodes[names[i]];
                const b = nodes[names[j]];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.max(40, Math.hypot(dx, dy));
                const attraction = (a.weight * b.weight) * 0.00055;
                const repulsion = 950 / (distance * distance);
                const force = attraction - repulsion;
                const fx = dx / distance * force;
                const fy = dy / distance * force;
                if (!a.fixed) { a.vx += fx * b.weight; a.vy += fy * b.weight; }
                if (!b.fixed) { b.vx -= fx * a.weight; b.vy -= fy * a.weight; }
              }
            }
            edges.forEach(([aName, bName]) => {
              const a = nodes[aName];
              const b = nodes[bName];
              if (!a || !b) return;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.max(1, Math.hypot(dx, dy));
              const desired = 150 - Math.min(45, (a.weight + b.weight) * 3);
              const pull = (distance - desired) * 0.006;
              const fx = dx / distance * pull;
              const fy = dy / distance * pull;
              if (!a.fixed) { a.vx += fx; a.vy += fy; }
              if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
            });
            names.forEach((nome) => {
              const data = nodes[nome];
              if (!data.fixed) {
                data.vx *= 0.88;
                data.vy *= 0.88;
                data.x += data.vx;
                data.y += data.vy;
                keepInside(data);
                updateNode(nome);
              }
            });
            redrawEdges();
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        function enableDrag(node, nome) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            nodes[nome].fixed = true;
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = graph.getBoundingClientRect();
            nodes[nome].x = event.clientX - rect.left;
            nodes[nome].y = event.clientY - rect.top;
            nodes[nome].vx = 0;
            nodes[nome].vy = 0;
            keepInside(nodes[nome]);
            updateNode(nome);
            redrawEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            nodes[nome].fixed = false;
            node.style.cursor = 'grab';
          });
        }
        function adicionarNo(nome, peso, x, y) {
          const weight = Math.max(1, Number(peso));
          const size = 34 + weight * 6;
          nodes[nome] = { x: Number(x), y: Number(y), weight, size, vx: 0, vy: 0, fixed: false };
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'node-' + nome;
          node.style.left = Number(x) + 'px';
          node.style.top = Number(y) + 'px';
          node.style.width = size + 'px';
          node.style.height = size + 'px';
          node.style.background = weight >= 6 ? '#d97706' : '#2f5d78';
          node.style.fontSize = Math.max(12, Math.min(18, size / 4)) + 'px';
          node.textContent = nome + ' ' + weight;
          graph.appendChild(node);
          nodes[nome].el = node;
          enableDrag(node, nome);
          window.exerciseState.nodes.push({ nome, peso: weight });
          startPhysics();
        }
        function ligar(a, b) {
          edges.push([a, b]);
          drawEdge(a, b);
          window.exerciseState.edges.push([a, b]);
          startPhysics();
        }
      `,
      validate: (code, state) => {
        const nodes = state.nodes || [];
        return nodes.length >= 4 &&
          nodes.some((node) => node.peso >= 5) &&
          new Set(nodes.map((node) => node.peso)).size >= 3 &&
          (state.edges || []).length >= 3 &&
          /adicionarNo/.test(code) &&
          /ligar/.test(code);
      },
    },
    {
      id: 'arvore-procura',
      advanced: [
        'Numa árvore binária de procura, cada decisão (esquerda ou direita) elimina metade dos valores restantes, por isso a procura cresce com o logaritmo do tamanho — muito mais rápido do que percorrer uma lista do início ao fim quando há muitos dados.',
      ],
      title: 'Procura numa lista e numa árvore',
      points: 40,
      explanation: [
        'Procurar é uma tarefa muito comum. Imagina que tens muitos números e queres encontrar uma opção escolhida. Uma forma simples é ver a lista desde o início, um valor de cada vez.',
        'Essa procura linear funciona, mas pode ser lenta se a lista for grande. Uma árvore binária de procura organiza os valores: menores à esquerda, maiores à direita.',
        'Com essa organização, em cada passo podemos eliminar uma parte da árvore. Se escolhes procurar 6 e começas em 8, sabes que 6 está do lado esquerdo. Depois de 3, sabes que 6 está do lado direito.',
        'Neste exercício vais escrever a lista, escolher o alvo e mostrar os dois caminhos. Assim consegues ver a rota tomada pela lista e pela árvore para a mesma opção.',
      ],
      instructions: [
        'Cria uma lista [valores] do tipo [number[]] com pelo menos 5 números diferentes.',
        'Chama [mostrarLista(valores)].',
        'Chama [criarArvore(valores)] para construir a árvore a partir da tua lista.',
        'Cria uma variável [alvo] com um número que exista na lista.',
        'Escreve a função [procurarNaLista(lista, alvo)].',
        'Dentro dessa função, usa um ciclo for e chama [visitarLista(i, valor)] para mostrar cada passo.',
        'Quando encontrares o [alvo], pára a procura.',
        'Chama [procurarNaArvore(alvo)].',
        'Arrasta os nós da árvore para veres as ligações reagirem com física simples.',
        'Experimenta o tamanho dos nós da árvore para veres a visualização sem alterar o algoritmo.',
      ],
      observation: 'A lista destaca os valores visitados por ordem. A árvore destaca o caminho que segue com decisões de menor ou maior.',
      hint: 'Dentro de [procurarNaLista], percorre a lista com [for]. Em cada volta, guarda [lista[i]] numa variável [valor], chama [visitarLista(i, valor)], e usa [if] para parar quando [valor] === [alvo].',
      starter: 'const valores: number[] = [];\nconst alvo: number = 0;\n\nfunction procurarNaLista(lista: number[], alvo: number): void {\n  iniciarProcuraLista(alvo);\n\n  // percorre a lista aqui\n  // chama visitarLista(i, valor) em cada passo\n\n  concluirProcuraLista();\n}\n\n// mostra a lista e cria a árvore\n\n// procura o alvo nas duas estruturas\n\nmudarTamanhoNos(54);',
      solution: 'const valores: number[] = [8, 3, 10, 1, 6, 14, 4];\nconst alvo: number = 6;\n\nfunction procurarNaLista(lista: number[], alvo: number): void {\n  iniciarProcuraLista(alvo);\n\n  for (let i = 0; i < lista.length; i++) {\n    const valor: number = lista[i];\n    visitarLista(i, valor);\n\n    if (valor === alvo) {\n      break;\n    }\n  }\n\n  concluirProcuraLista();\n}\n\nmostrarLista(valores);\ncriarArvore(valores);\nprocurarNaLista(valores, alvo);\nprocurarNaArvore(alvo);\n\nmudarTamanhoNos(54);',
      html: `
        <main class="stage">
          <section class="panel">
            <h2>Lista vs árvore</h2>
            <p>A lista está organizada assim:</p>
            <ul class="structured-list" id="value-list"></ul>
            <p id="list-result">Lista: ainda não procurou.</p>
            <p id="tree-result">Árvore: ainda não procurou.</p>
            <div class="tree-area" id="tree"></div>
          </section>
        </main>
      `,
      api: `
        const tree = document.getElementById('tree');
        const valueList = document.getElementById('value-list');
        let treeRoot = null;
        let physicsStarted = false;
        const treeEdges = [];
        const positions = {};
        window.exerciseState.listValues = [];
        window.exerciseState.treeValues = [];
        function line(a, b) {
          const start = positions[a];
          const end = positions[b];
          if (!start || !end) return;
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const edge = document.createElement('div');
          edge.className = 'edge';
          edge.style.left = start.x + 'px';
          edge.style.top = start.y + 'px';
          edge.style.width = Math.hypot(dx, dy) + 'px';
          edge.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
          tree.appendChild(edge);
        }
        function redrawTreeEdges() {
          tree.querySelectorAll('.edge').forEach((edge) => edge.remove());
          treeEdges.forEach(([a,b]) => line(a,b));
        }
        function updateTreeNode(value) {
          const data = positions[value];
          if (!data?.el) return;
          data.el.style.left = data.x + 'px';
          data.el.style.top = data.y + 'px';
        }
        function keepInside(data) {
          const rect = tree.getBoundingClientRect();
          data.x = Math.max(28, Math.min(rect.width - 28, data.x));
          data.y = Math.max(28, Math.min(rect.height - 28, data.y));
        }
        function enableDrag(node, value) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            positions[value].fixed = true;
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = tree.getBoundingClientRect();
            positions[value].x = event.clientX - rect.left;
            positions[value].y = event.clientY - rect.top;
            positions[value].vx = 0;
            positions[value].vy = 0;
            keepInside(positions[value]);
            updateTreeNode(value);
            redrawTreeEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            positions[value].fixed = false;
            node.style.cursor = 'grab';
          });
        }
        function startTreePhysics() {
          if (physicsStarted) return;
          physicsStarted = true;
          function tick() {
            Object.keys(positions).forEach((value) => {
              const data = positions[value];
              if (data.fixed) return;
              data.vx += (data.homeX - data.x) * 0.002;
              data.vy += (data.homeY - data.y) * 0.002;
            });
            treeEdges.forEach(([aValue, bValue]) => {
              const a = positions[aValue];
              const b = positions[bValue];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.max(1, Math.hypot(dx, dy));
              const pull = (distance - 115) * 0.005;
              const fx = dx / distance * pull;
              const fy = dy / distance * pull;
              if (!a.fixed) { a.vx += fx; a.vy += fy; }
              if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
            });
            Object.keys(positions).forEach((value) => {
              const data = positions[value];
              if (!data.fixed) {
                data.vx *= 0.88;
                data.vy *= 0.88;
                data.x += data.vx;
                data.y += data.vy;
                keepInside(data);
                updateTreeNode(value);
              }
            });
            redrawTreeEdges();
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        function insertNode(root, value) {
          if (!root) return { value, left: null, right: null };
          if (value < root.value) root.left = insertNode(root.left, value);
          if (value > root.value) root.right = insertNode(root.right, value);
          return root;
        }
        function collectEdges(node) {
          if (!node) return;
          if (node.left) {
            treeEdges.push([node.value, node.left.value]);
            collectEdges(node.left);
          }
          if (node.right) {
            treeEdges.push([node.value, node.right.value]);
            collectEdges(node.right);
          }
        }
        function placeNodes(node, minX, maxX, depth) {
          if (!node) return;
          const x = (minX + maxX) / 2;
          const y = 55 + depth * 78;
          positions[node.value] = { x, y, homeX: x, homeY: y, vx: 0, vy: 0, fixed: false };
          placeNodes(node.left, minX, x, depth + 1);
          placeNodes(node.right, x, maxX, depth + 1);
        }
        function renderTreeNode(value) {
          const pos = positions[value];
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'tree-' + value;
          node.style.left = pos.x + 'px';
          node.style.top = pos.y + 'px';
          node.textContent = value;
          tree.appendChild(node);
          pos.el = node;
          enableDrag(node, value);
        }
        function mostrarLista(lista) {
          const values = lista.map(Number);
          valueList.innerHTML = '';
          values.forEach((value, index) => {
            const item = document.createElement('li');
            item.id = 'list-' + index;
            item.textContent = index + ': ' + value;
            valueList.appendChild(item);
          });
          window.exerciseState.listValues = values;
        }
        function criarArvore(lista) {
          const values = lista.map(Number);
          treeRoot = null;
          treeEdges.length = 0;
          Object.keys(positions).forEach((key) => delete positions[key]);
          tree.querySelectorAll('.node, .edge').forEach((item) => item.remove());
          values.forEach((value) => {
            treeRoot = insertNode(treeRoot, value);
          });
          collectEdges(treeRoot);
          placeNodes(treeRoot, 45, 475, 0);
          Object.keys(positions).forEach((value) => renderTreeNode(value));
          redrawTreeEdges();
          startTreePhysics();
          window.exerciseState.treeValues = values;
        }
        function iniciarProcuraLista(alvo) {
          document.querySelectorAll('#value-list li').forEach((item) => item.classList.remove('active'));
          const target = Number(alvo);
          window.exerciseState.listPath = [];
          window.exerciseState.listSteps = 0;
          window.exerciseState.listTarget = target;
          setText('list-result', 'Lista: à procura de ' + target + '...');
        }
        function visitarLista(index, valor) {
          const value = Number(valor);
          window.exerciseState.listPath = [...(window.exerciseState.listPath || []), value];
          window.exerciseState.listSteps = window.exerciseState.listPath.length;
          document.getElementById('list-' + index)?.classList.add('active');
          setText('list-result', 'Lista: ' + window.exerciseState.listPath.join(' → ') + ' (' + window.exerciseState.listSteps + ' passos)');
          return value === window.exerciseState.listTarget;
        }
        function concluirProcuraLista() {
          const steps = window.exerciseState.listPath || [];
          const target = window.exerciseState.listTarget;
          const found = steps[steps.length - 1] === target;
          setText('list-result', 'Lista: ' + steps.join(' → ') + (found ? '' : ' → não encontrado') + ' (' + steps.length + ' passos)');
          window.exerciseState.listSteps = steps.length;
        }
        function procurarNaArvore(alvo) {
          document.querySelectorAll('#tree .node').forEach((node) => node.classList.remove('active'));
          const steps = [];
          const target = Number(alvo);
          let current = treeRoot;
          while (current) {
            steps.push(current.value);
            document.getElementById('tree-' + current.value)?.classList.add('active');
            if (current.value === target) break;
            current = target < current.value ? current.left : current.right;
          }
          const found = steps[steps.length - 1] === target;
          setText('tree-result', 'Árvore: ' + steps.join(' → ') + (found ? '' : ' → não encontrado') + ' (' + steps.length + ' passos)');
          window.exerciseState.treeSteps = steps.length;
          window.exerciseState.treeTarget = target;
          window.exerciseState.treePath = steps;
        }
        function mudarTamanhoNos(tamanho) {
          const size = Number(tamanho);
          document.querySelectorAll('.node').forEach((node) => {
            node.style.width = size + 'px';
            node.style.height = size + 'px';
          });
          window.exerciseState.nodeSize = size;
        }
      `,
      visualControls: [
        {
          label: 'Tamanho dos nós',
          type: 'range',
          min: 36,
          max: 82,
          step: 2,
          defaultValue: 54,
          pattern: 'mudarTamanhoNos\\((\\d+)\\);?',
          template: (value) => `mudarTamanhoNos(${value});`,
        },
      ],
      validate: (code, state) =>
        /number\[\]/.test(code) &&
        /function\s+procurarNaLista/.test(code) &&
        /\bfor\s*\(/.test(code) &&
        /visitarLista/.test(code) &&
        /mostrarLista/.test(code) &&
        /criarArvore/.test(code) &&
        /procurarNaLista/.test(code) &&
        /procurarNaArvore/.test(code) &&
        (state.listValues || []).length >= 5 &&
        state.listTarget === state.treeTarget &&
        (state.listValues || []).includes(state.listTarget),
    },
  ],
});
