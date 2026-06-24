// Canonical exercise order. Definitions live in assets/exercises/*.js.
// 07-interativo.js loads last and overrides by id (terminal / lerInput variants:
// falar, calculadora-interativa, cifra-interativa, adivinhar-numero).
window.Curriculum = (() => {
  const plan = [
    {
      id: 'fundamentos',
      title: 'Primeiros Programas e Texto',
      exercises: ['intro', 'ola', 'strings', 'const-let', 'falar'],
    },
    {
      id: 'numeros',
      title: 'Números, Contas e Input',
      exercises: ['numeros-precedencia', 'numeros-variavel', 'numeros-divisao', 'numeros-com-if', 'numeros-divisao-zero', 'calculadora-interativa', 'palavra-passe'],
    },
    {
      id: 'ciclos',
      title: 'Decisões, Ciclos e Jogos',
      exercises: ['operadores-logicos', 'booleanos', 'semaforo-amarelo', 'par-impar', 'aleatorio', 'while', 'arrays-indices', 'listas', 'ciclos-for', 'adivinhar-numero'],
    },
    {
      id: 'donatello',
      title: 'Donatello e Movimento',
      exercises: ['donatello', 'donatello-circulo', 'donatello-oito', 'donatello-oito-if', 'donatello-roomba'],
    },
    {
      id: 'cifras',
      title: 'Cifras e Texto',
      exercises: ['cesar', 'cesar-desencriptar', 'cifra-interativa'],
    },
    {
      id: 'matematica',
      title: 'Fórmulas, Aleatoriedade e Pi',
      exercises: ['formula', 'pi-coordenadas', 'pi'],
    },
    {
      id: 'estruturas',
      title: 'Grafos, Redes e Procura',
      exercises: ['grafo-criar', 'grafo-caminho', 'rede-pesos', 'arvore-intro', 'arvore-procura'],
    },
    {
      id: 'desafios',
      title: 'Desafios de Programação',
      exercises: ['arquiteto', 'mvp-futebol'],
    },
  ];

  function build(sourceTopics = window.exerciseTopics || []) {
    const byId = new Map();
    sourceTopics.forEach((topic) => {
      topic.exercises.forEach((exercise) => byId.set(exercise.id, exercise));
    });

    const used = new Set();
    const topics = plan.map((topic) => ({
      id: topic.id,
      title: topic.title,
      exercises: topic.exercises
        .map((id) => {
          const exercise = byId.get(id);
          if (exercise) used.add(id);
          return exercise;
        })
        .filter(Boolean),
    })).filter((topic) => topic.exercises.length);

    const leftovers = sourceTopics
      .flatMap((topic) => topic.exercises)
      .filter((exercise) => !used.has(exercise.id));

    if (leftovers.length) {
      topics.push({
        id: 'outros',
        title: 'Outros Exercícios',
        exercises: leftovers,
      });
    }

    const exercises = topics.flatMap((topic) => (
      topic.exercises.map((exercise) => ({ ...exercise, topic: topic.title }))
    ));

    return { topics, exercises };
  }

  return { build };
})();
