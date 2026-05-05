window.exerciseTopics = window.exerciseTopics || [];

window.exerciseTopics.push({
  id: 'estruturas',
  title: 'Grafos, Árvores e Procura',
  exercises: [
    {
      id: 'grafo-criar',
      title: 'Ligar pontos',
      points: 20,
      explanation: [
        'Um grafo é uma forma de representar objetos ligados entre si. Os objetos são nós; as ligações são arestas.',
        'Pensa num mapa: as cidades são nós e as estradas são arestas. Numa rede social, as pessoas são nós e as amizades são arestas.',
        'Neste exercício vais criar nós com posições no ecrã e depois criar ligações entre eles. O objetivo é perceber que a estrutura do problema pode ser desenhada.',
      ],
      instructions: [
        'Cria pelo menos 4 nós com adicionarNo.',
        'Cria pelo menos 3 ligações com ligar.',
        'Observa como as arestas unem os nós.',
      ],
      observation: 'O grafo deve ter vários pontos ligados. A posição x controla a horizontal; y controla a vertical.',
      hint: 'Cria primeiro todos os nós. Depois liga pares de nós pelos nomes que escolheste.',
      starter: 'adicionarNo("A", 120, 90);\nadicionarNo("B", 300, 90);\n\nligar("A", "B");',
      solution: 'adicionarNo("A", 120, 90);\nadicionarNo("B", 300, 90);\nadicionarNo("C", 210, 210);\nadicionarNo("D", 390, 220);\n\nligar("A", "B");\nligar("A", "C");\nligar("C", "D");',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Grafo</h1>
            <div class="graph-area" id="graph"></div>
          </section>
        </main>
      `,
      api: `
        const graph = document.getElementById('graph');
        const nodes = {};
        const edges = [];
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
        function enableDrag(node, nome) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = graph.getBoundingClientRect();
            nodes[nome].x = Math.max(28, Math.min(rect.width - 28, event.clientX - rect.left));
            nodes[nome].y = Math.max(28, Math.min(rect.height - 28, event.clientY - rect.top));
            node.style.left = nodes[nome].x + 'px';
            node.style.top = nodes[nome].y + 'px';
            redrawEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            node.style.cursor = 'grab';
          });
        }
        function adicionarNo(nome, x, y) {
          nodes[nome] = { x: Number(x), y: Number(y) };
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'node-' + nome;
          node.style.left = Number(x) + 'px';
          node.style.top = Number(y) + 'px';
          node.textContent = nome;
          graph.appendChild(node);
          enableDrag(node, nome);
          window.exerciseState.nodes.push(nome);
        }
        function ligar(a, b) {
          edges.push([a, b]);
          drawEdge(a, b);
          window.exerciseState.edges.push([a, b]);
        }
      `,
      validate: (code, state) => (state.nodes || []).length >= 4 && (state.edges || []).length >= 3,
    },
    {
      id: 'grafo-caminho',
      title: 'Mostrar um caminho',
      points: 20,
      explanation: [
        'Depois de desenharmos um grafo, podemos fazer perguntas sobre ele. Uma pergunta comum é: por que caminho posso ir de um ponto a outro?',
        'Um caminho é uma lista de nós por ordem. Por exemplo, ["A", "C", "D"] significa: começa em A, passa por C e termina em D.',
        'Repara que uma lista aqui não é só um conjunto de coisas. A ordem importa. Trocar a ordem pode significar outro caminho.',
      ],
      instructions: [
        'Chama criarMapa() para desenhar o grafo inicial.',
        'Usa marcarCaminho com a lista ["A", "C", "D"].',
      ],
      observation: 'Os nós do caminho devem ficar destacados.',
      hint: 'Um caminho é uma lista ordenada de nomes. A ordem deve ir do início até ao destino.',
      starter: 'criarMapa();\nmarcarCaminho([]);',
      solution: 'criarMapa();\nmarcarCaminho(["A", "C", "D"]);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Caminho</h1>
            <div class="graph-area" id="graph"></div>
          </section>
        </main>
      `,
      api: `
        const graph = document.getElementById('graph');
        const nodes = {};
        const edges = [];
        window.exerciseState.path = [];
        function drawEdge(a, b) {
          const start = nodes[a];
          const end = nodes[b];
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
        function enableDrag(node, nome) {
          node.addEventListener('pointerdown', (event) => {
            node.setPointerCapture(event.pointerId);
            node.style.cursor = 'grabbing';
          });
          node.addEventListener('pointermove', (event) => {
            if (!node.hasPointerCapture(event.pointerId)) return;
            const rect = graph.getBoundingClientRect();
            nodes[nome].x = Math.max(28, Math.min(rect.width - 28, event.clientX - rect.left));
            nodes[nome].y = Math.max(28, Math.min(rect.height - 28, event.clientY - rect.top));
            node.style.left = nodes[nome].x + 'px';
            node.style.top = nodes[nome].y + 'px';
            redrawEdges();
          });
          node.addEventListener('pointerup', (event) => {
            node.releasePointerCapture(event.pointerId);
            node.style.cursor = 'grab';
          });
        }
        function add(nome, x, y) {
          nodes[nome] = { x, y };
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'node-' + nome;
          node.style.left = x + 'px';
          node.style.top = y + 'px';
          node.textContent = nome;
          graph.appendChild(node);
          enableDrag(node, nome);
        }
        function edge(a, b) {
          edges.push([a, b]);
          drawEdge(a, b);
        }
        function criarMapa() {
          add('A', 110, 100); add('B', 280, 80); add('C', 190, 220); add('D', 390, 220);
          edge('A', 'B'); edge('A', 'C'); edge('B', 'D'); edge('C', 'D');
        }
        function marcarCaminho(caminho) {
          window.exerciseState.path = caminho;
          caminho.forEach((nome) => document.getElementById('node-' + nome)?.classList.add('active'));
        }
      `,
      validate: (code, state) => JSON.stringify(state.path) === JSON.stringify(['A', 'C', 'D']),
    },
    {
      id: 'arvore-procura',
      title: 'Procura numa lista e numa árvore',
      points: 30,
      explanation: [
        'Procurar é uma tarefa muito comum. Imagina que tens muitos números e queres saber onde está o 6. Uma forma simples é ver a lista desde o início, um valor de cada vez.',
        'Essa procura linear funciona, mas pode ser lenta se a lista for grande. Uma árvore binária de procura organiza os valores: menores à esquerda, maiores à direita.',
        'Com essa organização, em cada passo podemos eliminar uma parte da árvore. Se procuramos 6 e começamos em 8, sabemos que 6 está do lado esquerdo. Depois de 3, sabemos que 6 está do lado direito.',
        'Neste exercício vais mostrar os dois caminhos. A ideia não é provar matematicamente que a árvore é sempre melhor; é ver visualmente que uma boa estrutura de dados pode reduzir o número de passos.',
      ],
      instructions: [
        'Chama procurarNaLista(6).',
        'Chama procurarNaArvore(6).',
        'Compara os passos mostrados no painel.',
      ],
      observation: 'A lista organizada é mostrada antes da árvore. A lista visita mais valores; a árvore deve encontrar o 6 com menos passos.',
      hint: 'Usa o mesmo alvo nas duas procuras para poderes comparar os passos de forma justa.',
      starter: 'procurarNaLista(0);\nprocurarNaArvore(0);',
      solution: 'procurarNaLista(6);\nprocurarNaArvore(6);',
      html: `
        <main class="stage">
          <section class="panel">
            <h1>Lista vs árvore</h1>
            <p>A lista está organizada assim:</p>
            <ul class="structured-list" id="value-list"></ul>
            <p id="list-result">Lista: ainda não procurou.</p>
            <p id="tree-result">Árvore: ainda não procurou.</p>
            <div class="tree-area" id="tree"></div>
          </section>
        </main>
      `,
      api: `
        const valores = [8, 3, 10, 1, 6];
        const tree = document.getElementById('tree');
        const valueList = document.getElementById('value-list');
        valores.forEach((value, index) => {
          const item = document.createElement('li');
          item.textContent = index + ': ' + value;
          valueList.appendChild(item);
        });
        const positions = { 8: [260, 60], 3: [160, 150], 10: [360, 150], 1: [110, 250], 6: [210, 250] };
        function line(a, b) {
          const start = positions[a];
          const end = positions[b];
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const edge = document.createElement('div');
          edge.className = 'edge';
          edge.style.left = start[0] + 'px';
          edge.style.top = start[1] + 'px';
          edge.style.width = Math.hypot(dx, dy) + 'px';
          edge.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
          tree.appendChild(edge);
        }
        [[8,3], [8,10], [3,1], [3,6]].forEach(([a,b]) => line(a,b));
        valores.forEach((value) => {
          const pos = positions[value];
          const node = document.createElement('div');
          node.className = 'node';
          node.id = 'tree-' + value;
          node.style.left = pos[0] + 'px';
          node.style.top = pos[1] + 'px';
          node.textContent = value;
          tree.appendChild(node);
        });
        function procurarNaLista(alvo) {
          const steps = [];
          for (const valor of valores) {
            steps.push(valor);
            if (valor === alvo) break;
          }
          setText('list-result', 'Lista: ' + steps.join(' → ') + ' (' + steps.length + ' passos)');
          window.exerciseState.listSteps = steps.length;
          window.exerciseState.listTarget = alvo;
        }
        function procurarNaArvore(alvo) {
          const steps = [];
          let current = 8;
          while (current !== undefined) {
            steps.push(current);
            document.getElementById('tree-' + current)?.classList.add('active');
            if (current === alvo) break;
            if (alvo < current) current = current === 8 ? 3 : current === 3 ? 1 : undefined;
            else current = current === 8 ? 10 : current === 3 ? 6 : undefined;
          }
          setText('tree-result', 'Árvore: ' + steps.join(' → ') + ' (' + steps.length + ' passos)');
          window.exerciseState.treeSteps = steps.length;
          window.exerciseState.treeTarget = alvo;
        }
      `,
      validate: (code, state) => state.listTarget === 6 && state.treeTarget === 6 && state.treeSteps < state.listSteps,
    },
  ],
});
