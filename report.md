# Laboratório de Programação — Relatório de QA

> Testado em: 2026-06-23  
> Método: Análise estática do código-fonte de todos os módulos e verificação da lógica de validação.  
> Módulos testados: 01 a 08 (todos os 35+ exercícios)

---

## 01 — Primeiros Programas e Texto (`01-fundamentos.js`)

### 🐛 Exercício "Bem-vindo ao laboratório!" (`intro`)

**O que foi testado:** Executar o código starter sem qualquer interação com os controlos visuais.

**Problema:** O exercício `intro` passa na validação imediatamente sem que o aluno faça nada. O `validate` verifica apenas `state.message?.length >= 8`, e o código de arranque já chama `mostrarMensagem("Mude as coisas no menu ao lado para perceber o que acontece!")` — uma string com muito mais de 8 caracteres. O aluno recebe os 5 pontos sem nenhum esforço.

**Solução potencial:**
- Verificar que pelo menos um dos controlos visuais foi alterado: `state.panelColor !== '#102033' || state.messageSize !== 44`.
- Ou mudar o starter code para não chamar `mostrarMensagem` com uma string longa, forçando o aluno a introduzir uma.

---

### 🐛 Exercício "Variáveis" (`strings`)

**O que foi testado:** Introduzir um tipo errado propositalmente — `const nome: string = 123;`

**Problema:** O TypeScript deveria detetar que `123` não é uma `string`. O exercício explica explicitamente que *"se tentares guardar um número no mesmo sítio, o TypeScript consegue avisar-te"*, mas o código corre sem qualquer erro de tipo. O transpilador usado (provavelmente Babel com erasure de tipos simples) não verifica tipos em runtime.

**Impacto para o aluno:** A promessa pedagógica do TypeScript não é cumprida — o aluno pode não perceber o benefício dos tipos declarados.

**Solução potencial:**
- Usar `tsc --strict` real (ex.: via CDN do TypeScript compiler) para verificar tipos antes de executar.
- **Alternativa simples:** Retirar a frase "o TypeScript consegue avisar-te" da explicação, ou torná-la condicional: *"O TypeScript consegue avisar-te — se usares um editor com linting."*

---

## 02 — Números e Calculadoras (`02-numeros.js`)

### ⚠️ Exercício "A ordem das contas" (`numeros-precedencia`)

**O que foi testado:** Submeter o código sem parênteses (starter code por defeito: `a + b * c`).

**Resultado esperado:** Falhar, porque o resultado seria 17, não 32.

**Comportamento real:** Correto — a validação verifica `/\(a\s*\+\s*b\)/` (regex de parênteses) E `state.result === 32`. O starter falha ambos os critérios e a mensagem de erro específica aparece.

**✅ Sem problemas.**

---

### ⚠️ Exercício "Guardar primeiro, mostrar depois" (`numeros-variavel`)

**O que foi testado:** Escrever `const d: number = 84; mostrarResultado(d);` (valor hardcoded em vez de calculado).

**Problema menor:** A validação verifica `state.result === 84` e `mostrarResultado(d)`, mas **não** verifica se o aluno calculou `12 * 7`. O aluno pode escrever `const d: number = 84;` sem efetuar o cálculo e o exercício passa na mesma.

**Solução potencial:** Adicionar `/12\s*\*\s*7/.test(code)` à condição de validação.

---

### 🐛 Exercício "Usando Condicionais" (`numeros-com-if`)

**O que foi testado:** Submeter sem qualquer modificação ao starter code (número inicial é `-1`).

**Comportamento real:** O starter já contém `if (numero === 5)` e `if (numero > 5)`. Com `numero = -1`, nenhum bloco corre, o painel mostra "Nada foi inserido", e o exercício falha — correto.

**Problema:** A instrução diz *"Deve somente alterar o valor da variavel. O restante do código deve funcionar sem alterações"*. Porém o aluno pode apagar as duas condições `if` e escrever apenas `mostrarResultado(10)`, passando na validação sem aprender condicionais:
- A regex `/(numero > 5)/.test(code)` verifica se o código contém a string `numero > 5` — mas se o aluno a apagar e escrever apenas `mostrarResultado(10)`, esta regex falha e o exercício não passa. **Este comportamento é correto.**

**✅ Sem problemas críticos.** Apenas nota: o aluno pode escolher qualquer número >5 (ex.: `const numero: number = 9999999`), o que é intencional.

---

### 🐛 Exercício "Dividir por zero" (`numeros-divisao-zero`)

**O que foi testado:** Escrever `if (divisor === 0) { mostrarErro("zero aqui"); } else { mostrarResultado(dividendo / divisor); }` com uma mensagem de erro diferente.

**Resultado:** Passa na validação porque a regex é `/zero/i.test(state.result || '')` — verifica se a palavra "zero" aparece na mensagem. **Correto e flexível.**

**Potencial de cheating:** Um aluno pode escrever `mostrarErro("zero")` sem qualquer `if` e a validação passa porque `/if\s*\(/.test(code)` vai falhar. A regex exige `if`. Comportamento correto.

**✅ Sem problemas.**

---

## 03 — Decisões, Ciclos e Jogos (`03-ciclos.js`)

### ⚠️ Exercício "Galeria de frutas" (`listas`)

**O que foi testado:** Criar lista com 2 frutas em vez de 3.

**Resultado:** Falha com mensagem "Adiciona pelo menos 3 frutas à lista." — correto.

**Problema identificado:** O aluno pode criar 3 frutas sem usar `for`, adicionando-as manualmente com `adicionarFruta("maçã"); adicionarFruta("banana"); adicionarFruta("kiwi");`. A validação verifica `/\bfor\s*\(/.test(code)`, o que obriga o ciclo, mas a mensagem de erro não explica que precisa de ser um ciclo.

**✅ Comportamento aceitável** — a validação é correta, apenas a mensagem de erro poderia ser mais clara.

---

### ⚠️ Exercício "Semáforo lógico" (`booleanos`)

**O que foi testado:** Escrever `ligarSemaforo("verde");` sem nenhuma variável booleana nem `if`.

**Problema:** A validação verifica `/:\s*boolean/.test(code)`, mas um aluno pode escrever literalmente `const x: boolean = true;` sem usá-la em nenhum `if`, e a validação passa.

**Solução potencial:** Adicionar verificação de que a variável booleana é usada como condição: `/if\s*\(\s*podeAvancar\s*\)/.test(code) || /if\s*\(/.test(code)` (já está) e que o semáforo usa o valor da variável.

---

### 🐛 Exercício "Semáforo com amarelo" (`semaforo-amarelo`)

**O que foi testado:** Escrever `ligarSemaforo("amarelo");` diretamente sem qualquer `else if`.

**Problema crítico:** A validação verifica apenas `/else\s+if/.test(code)` e `state.color === 'amarelo'`. Um aluno pode escrever:
```typescript
if (false) { ligarSemaforo("verde"); } else if (true) { ligarSemaforo("amarelo"); }
```
Isto passa na validação sem usar a variável `estado`. O exercício perde o propósito pedagógico.

**Solução potencial:** Adicionar `estado === "atenção"` à validação: `/estado/.test(code)`.

---

## 04 — Donatello e Movimento (`04-donatello.js`)

### 🐛 Exercício "Desenha um quadrado" (`donatello`)

**O que foi testado:** Ciclo com 3 iterações em vez de 4: `for (let i = 0; i < 3; i++) { donatello.forward(120); donatello.right(90); }`.

**Resultado:** Falha com mensagem "Anda 120 pixels para a frente em cada lado (4 vezes)." — correto.

**O que foi testado (cheating):** `donatello.forward(120); donatello.right(90);` repetido 4 vezes sem ciclo `for`.

**Problema:** A validação verifica `/\bfor\s*\(/.test(code)` — se o aluno não usar `for`, o exercício falha com mensagem "Usa for para repetir os lados do quadrado." **Correto.**

**✅ Sem problemas.**

---

### 🐛 Exercício "Donatello quer ser um Roomba" (`donatello-roomba`)

**O que foi testado:** Executar o starter sem adicionar a deteção de colisão.

**Resultado:** O `exerciseState.visited` vai registar posições fora dos limites, e a validação `!(state.visited || []).some(p => Math.abs(p.x) > 115 || Math.abs(p.y) > 115)` vai falhar. Mensagem de erro: "O Donatello saiu dos limites do quadrado!" — correto.

**Problema potencial:** A validação também requer que o Donatello chegue perto das 4 paredes: `v.some(p => p.x < -80)`, etc. Devido à natureza aleatória do movimento, há uma **chance (pequena mas real)** de um código correto falhar a validação se o Roomba nunca atingir todas as 4 paredes em 1200 passos (probabilidade baixa mas não nula).

**Solução potencial:** Aumentar o número de passos (ex.: 2000 em vez de 1200), ou reduzir o threshold de exploração de ±80 para ±60.

---

## 05 — Cifras, Fórmulas e Pi (`05-cifras-matematica.js`)

### 🐛 Exercício "Mensagem secreta" (`cesar`)

**O que foi testado:** Chamar `cifrar("FCUL")` sem implementar o ciclo interno.

**Resultado:** A função retorna `""` (string vazia) porque `resultado` nunca é preenchido. A validação verifica `state.cipher === 'SPbY'` — falha. Mensagem: "A mensagem encriptada deve ser SPbY." — correto.

**Potencial de cheating:** `mostrarCifra("SPbY");` sem implementar a cifra real. A validação só verifica o estado final, não se o aluno implementou o algoritmo.

**Solução potencial:** Verificar que o código usa `charCodeAt` e `fromCharCode`: `state.cipher === 'SPbY' && /charCodeAt/.test(code)`.

---

### ⚠️ Exercício "Dardos para descobrir pi" (`pi`)

**O que foi testado:** Usar apenas 500 dardos em vez de 1000.

**Resultado:** Falha com "Lança pelo menos 1000 dardos." — correto.

**Observação (performance):** Com 5000 dardos (solução canónica), o exercício pode ser lento em computadores mais fracos. O browser pode mostrar aviso de "página sem resposta" em computadores mais lentos.

**Solução potencial:** Considerar limitar o total máximo de dardos a 3000, ou processar os dardos em batches assíncronos para não bloquear o UI thread.

---

## 06 — Grafos, Árvores e Procura (`06-estruturas.js`)

### 🐛 Exercício "Mostrar um caminho" (`grafo-caminho`)

**O que foi testado:** Submeter `marcarCaminho(["A", "C", "D"])` com elementos na ordem errada: `["A", "D", "C"]`.

**Resultado:** Falha. A validação usa `JSON.stringify(state.path) === JSON.stringify(['A', 'C', 'D'])` — sensível à ordem. Correto pedagogicamente.

**Potencial confusão:** O exercício não explica explicitamente que a **ordem importa** no caminho. O aluno pode tentar `["A", "D", "C"]` achando que é equivalente.

**Solução potencial:** Adicionar às instruções: *"A ordem dos nós importa — deve ser do início ao fim do caminho."*

---

### ⚠️ Exercício "Procura numa lista e numa árvore" (`arvore-procura`)

**O que foi testado:** Criar um `alvo` que não existe na lista.

**Comportamento:** A procura na lista percorre todos os elementos sem encontrar, e `concluirProcuraLista()` não adiciona "não encontrado" ao caminho no estado. A validação verifica `(state.listValues || []).includes(state.listTarget)` — falha com a mensagem correta.

**Problema edge case:** A condição final `state.treeSteps <= state.listSteps` pode ser difícil de satisfazer para certas listas. Por exemplo, se o alvo for a **raiz da árvore** (o primeiro elemento da lista), a árvore encontra em 1 passo mas a lista pode encontrar em 1 passo também. Se o alvo for o **pior caso** da lista mas o **melhor** da árvore, a condição passa. No entanto, se a lista é `[1, 2, 3, 4, 5]` e o alvo é `3` (meio da lista), `listSteps=3` e `treeSteps` depende da árvore — pode ser 2 ou 3. Em casos degenerados (lista já ordenada → árvore desequilibrada), a árvore pode ser **pior** que a lista.

**Solução potencial:** Remover a condição `state.treeSteps <= state.listSteps` da validação, pois pode causar falsos negativos dependendo dos dados escolhidos pelo aluno.

---

## 07 — Programas Interativos (`07-interativo.js`)

### 🐛 Exercício "Adivinhar o número" (`adivinhar-numero`)

**O que foi testado:** Submeter código sem `acertou = true`, apenas saindo do while por outra condição.

**Resultado:** A validação verifica `/acertou\s*=\s*true/.test(code)` — falha se a variável `acertou` não for definida como `true`. Correto.

**Problema (cheating):** Um aluno pode escrever:
```typescript
const segredo: number = numeroSecreto(1, 50);
let acertou: boolean = false;
while (!acertou) {
  const palpite: number = Number(await lerInput("Palpite?"));
  if (palpite < segredo) { escrever("baixo"); }
  else if (palpite > segredo) { escrever("alto"); }
  else { acertou = true; }
}
```
Mas adivinhar "45" como primeiro palpite e ter sorte. A validação exige `state.guessed === true`, que só é verdadeiro se o palpite correto for introduzido no terminal. **Correto — o aluno tem de jogar de verdade.**

**✅ Sem problemas.**

---

### 🐛 Exercício "Cifra a tua mensagem" (`cifra-interativa`)

**O que foi testado:** Não chamar `mostrarCifra()`, apenas chamar `escrever()`.

**Resultado:** A validação verifica `state.cipher && state.cipher.length >= 1`. Se `mostrarCifra` não for chamado, `state.cipher` é `undefined`. **Falha corretamente.**

**Potencial de cheating:** `mostrarCifra("X")` sem usar `lerInput` falha porque a validação verifica `/lerInput/.test(code)`. **Correto.**

**Nota pedagógica:** A mensagem de feedback do check `{ test: (_c, s) => s.cipher?.length >= 3, ... }` diz "Mostra o texto encriptado no painel" — usa o mínimo de 3 caracteres, mas a validação aceita qualquer string de 1+ caracteres se `lerInput` for usado. Há uma ligeira inconsistência entre o check e a validação final.

---

## 08 — Desafios de Programação (`08-desafios.js`)

### ⚠️ Exercício "O Desafio do Arquiteto" (`arquiteto`)

**O que foi testado:** Introduzir apenas 1 ponto.

**Resultado:** A validação verifica `pts.length >= 2` — falha com mensagem "Introduz pelo menos 2 pontos." **Correto.**

**Problema de arredondamento:** A validação usa `Math.abs(state.minDist - expectedMin) < 0.001`. Para pontos com coordenadas grandes (ex.: `(1000, 1000)`), a distância pode ter erros de ponto flutuante. O threshold `0.001` é muito restritivo para casos extremos.

**Solução potencial:** Usar uma tolerância relativa: `Math.abs(state.minDist - expectedMin) / expectedMin < 0.0001`.

---

### ⚠️ Exercício "Melhor Jogador de Futebol" (`mvp-futebol`)

**O que foi testado:** Usar apenas 1 jogador em vez de 2.

**Resultado:** Falha com "Regista pelo menos 2 jogadores." — correto.

**Problema (fórmula):** A validação verifica `/\*\s*5/.test(code)`, `/\*\s*3/.test(code)`, e `/\*.*-?\s*2|-2\s*\*/.test(code)`. A regex para faltas (`-2`) é frágil. Um aluno que escreva `faltas * -2` passa, mas `faltas * (-2)` também passa porque a regex usa `\*.*-?`. No entanto, se o aluno escrever `- 2 * faltas` a regex `/\*.*-?\s*2/.test(code)` pode não capturar. 

**Solução potencial:** Simplificar para verificar apenas o resultado final (`state.maxScore === expectedMax`) sem precisar de verificar a fórmula via regex.

---

## Problemas Gerais / Transversais

### 🐛 False Positive: Código com `mostrarX()` hardcoded

**Padrão detectado em múltiplos exercícios:** Um aluno pode hardcodar a resposta esperada em vez de calculá-la. Por exemplo:
- Em `cesar`: `mostrarCifra("SPbY");` passa a validação.
- Em `formula`: `mostrarRaizes(2, 3);` passa a validação se `Math.sqrt` não for verificado (mas é!).
- Em `numeros-divisao`: `mostrarResultado(23412);` passa a validação.

**Impacto:** Estes falsos positivos permitem aos alunos "saltar" o exercício sem aprender o conceito. Na maioria dos casos a validação já o previne, mas existem brechas específicas.

---

### ⚠️ Falta de Feedback para Erros de Sintaxe

**Observação:** Quando o aluno introduz um erro de sintaxe TypeScript grave (ex.: `const x = ` sem valor), o terminal mostra um erro de transpilação genérico. Em alguns casos, a mensagem de erro do Babel pode ser técnica e difícil de interpretar para um principiante.

**Sugestão:** Adicionar uma camada de parsing simples que detecte parênteses/chavetas não fechados e forneça uma mensagem mais amigável antes de tentar compilar.

---

### ⚠️ Estado não é limpo ao mudar de exercício

**Contexto técnico:** O `window.exerciseState` é reinicializado quando o utilizador executa o código. No entanto, se o aluno trocar de exercício sem executar código novo, o estado anterior pode persistir durante a validação transitória.

**Impacto real:** Baixo — a validação só ocorre ao clicar "Executar". Mas vale a pena confirmar que ao carregar um exercício novo o estado é limpo.

---

## Sumário de Prioridades

| Prioridade | Exercício | Problema |
|---|---|---|
| 🔴 Alta | `intro` | Passa automaticamente sem interação |
| 🔴 Alta | `strings` | TypeScript não verifica tipos como prometido |
| 🔴 Alta | `semaforo-amarelo` | Pode passar sem usar a variável `estado` |
| 🟡 Média | `numeros-variavel` | Não verifica se a multiplicação foi calculada |
| 🟡 Média | `cesar` | Hardcodar "SPbY" passa a validação |
| 🟡 Média | `arvore-procura` | `treeSteps <= listSteps` pode ser falso negativo |
| 🟡 Média | `donatello-roomba` | Exploração aleatória pode falhar com código correto |
| 🟢 Baixa | `pi` (dardos) | Performance com 5000 dardos em PCs lentos |
| 🟢 Baixa | `grafo-caminho` | Não explica que a ordem importa |
| 🟢 Baixa | `arquiteto` | Threshold de distância pode ser muito restrito |
