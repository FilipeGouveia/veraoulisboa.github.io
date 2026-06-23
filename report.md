# Laboratório de Programação — Relatório de QA

> Testado em: 2026-06-23  
> Método: Análise estática do código-fonte de todos os módulos e verificação da lógica de validação.  
> Módulos testados: 01 a 08 (todos os 35+ exercícios)

---

## Ronda 1 — Problemas Originais

*(Identificados na primeira sessão de QA)*

### 01 — Primeiros Programas e Texto (`01-fundamentos.js`)

#### 🐛 Exercício "Bem-vindo ao laboratório!" (`intro`)
Passava automaticamente com o starter code sem qualquer interação do aluno.

#### 🐛 Exercício "Variáveis" (`strings`)
A explicação afirmava que o TypeScript detectaria erros de tipo, mas o transpilador não valida tipos em runtime.

### 02 — Números e Calculadoras (`02-numeros.js`)

#### 🐛 Exercício "Guardar primeiro, mostrar depois" (`numeros-variavel`)
Podia ser concluído com `const d: number = 84;` (hardcoded) sem efetuar o cálculo `12 * 7`.

### 03 — Decisões, Ciclos e Jogos (`03-ciclos.js`)

#### 🐛 Exercício "Semáforo com amarelo" (`semaforo-amarelo`)
Podia ser concluído sem usar a variável `estado` (ex.: `else if (true) { ligarSemaforo("amarelo"); }`).

### 04 — Donatello e Movimento (`04-donatello.js`)

#### 🐛 Exercício "Donatello quer ser um Roomba" (`donatello-roomba`)
Com 1200 passos e threshold ±80, código correto podia falhar ocasionalmente devido à aleatoriedade.

### 05 — Cifras, Fórmulas e Pi (`05-cifras-matematica.js`)

#### 🐛 Exercício "Mensagem secreta" (`cesar`)
Podia ser concluído com `mostrarCifra("SPbY")` sem implementar o algoritmo de cifra.

#### ⚠️ Exercício "Dardos para descobrir pi" (`pi`)
Solução canónica usava 5000 dardos, podendo congelar PCs lentos.

### 06 — Grafos, Árvores e Procura (`06-estruturas.js`)

#### 🐛 Exercício "Procura numa lista e numa árvore" (`arvore-procura`)
A condição `treeSteps <= listSteps` causava falsos negativos em listas ordenadas (árvore degenerada).

#### ⚠️ Exercício "Mostrar um caminho" (`grafo-caminho`)
As instruções não explicavam que a ordem dos nós importa na lista do caminho.

---

## Ronda 2 — Verificação das Correções (2026-06-23, sessão 2)

Verificado por análise estática do commit `ac1fead` ("fix: close QA validation gaps across seven exercises") e `8a03780` ("feat: lighten pi solution and clarify grafo-caminho ordering").

### ✅ `intro` — CORRIGIDO

**Verificação:** O `validate` agora exige `state.panelColor !== '#3b93ff' || state.messageSize !== 44`, obrigando o aluno a mudar pelo menos um controlo visual. O exercício-checks também foi atualizado com a mesma condição. O `solution` foi atualizado para usar uma cor e tamanho diferentes do starter.

**Novo problema encontrado (🐛):** A condição verifica `state.panelColor !== '#3b93ff'` mas o valor inicial do controlo visual é `#102033` (não `#3b93ff`). O starter chama `mudarCorPainel("#3b93ff")` no código, por isso quando o código corre sem ser modificado, `state.panelColor` fica `#3b93ff`. A condição está tecnicamente correta — mas se o aluno mudar o código manualmente para `mudarCorPainel("#102033")` (o valor por defeito do controlo), o painel fica com a cor do controlo mas o estado ainda é diferente de `#3b93ff`, logo passa indevidamente. **Impacto baixo** — improvável em contexto de aula.

**Estado: ✅ Essencialmente corrigido.**

---

### ✅ `strings` — CORRIGIDO

**Verificação:** A explicação foi atualizada. A frase "se tentares guardar um número no mesmo sítio, o TypeScript consegue avisar-te" foi substituída por "Aqui no laboratório o tipo serve sobretudo como documentação — num editor com TypeScript, tentar guardar um número onde se espera texto seria assinalado como erro." — honesta e pedagogicamente correta.

**Estado: ✅ Corrigido.**

---

### ✅ `numeros-variavel` — CORRIGIDO

**Verificação:** O `validate` agora inclui `/(12\s*\*\s*7|7\s*\*\s*12)/.test(code)`. O `exercise-checks` também tem o check correspondente com mensagem "Calcula 12 * 7 em vez de escrever o resultado diretamente."

**Estado: ✅ Corrigido.**

---

### ✅ `semaforo-amarelo` — CORRIGIDO

**Verificação:** O `validate` agora inclui `/estado\s*===/.test(code)`. O check de feedback diz "Decide com base na variável estado (ex.: estado === "atenção")."

**Estado: ✅ Corrigido.**

---

### ✅ `cesar` — CORRIGIDO

**Verificação:** O `validate` agora exige `/charCodeAt/.test(code) && /fromCharCode/.test(code)`. O exercise-check correspondente foi adicionado com mensagem clara.

**Estado: ✅ Corrigido.**

---

### ✅ `pi` (dardos) — CORRIGIDO

**Verificação:** A solução canónica foi reduzida de 5000 para 2000 dardos. O check de validação ainda exige `state.total >= 1000`, e a estimativa deve estar dentro de ±0.25 de π — com 2000 dardos isto é garantido com ≈99.9% de probabilidade.

**Estado: ✅ Corrigido.**

---

### ✅ `arvore-procura` — CORRIGIDO

**Verificação:** A condição `state.treeSteps <= state.listSteps` foi removida do `validate`. O exercise-check correspondente foi também removido.

**Estado: ✅ Corrigido.**

---

### ✅ `grafo-caminho` — CORRIGIDO

**Verificação:** Adicionada uma nova instrução: "A ordem dos nós importa: o caminho deve ir do início ([A]) até ao fim ([D]) — ["A", "D", "C"] seria um caminho diferente."

**Estado: ✅ Corrigido.**

---

### ✅ `donatello-roomba` — CORRIGIDO

**Verificação:** Loop bumped to 2000 steps e wall-reach threshold lowered from ±80 to ±60 in both `validate` and exercise-checks.

**Estado: ✅ Corrigido.**

---

## Ronda 2 — Novos Problemas Encontrados

### 🔴 CRÍTICO — `main.js`: função `initApp` duplicada

**Ficheiro:** `assets/main.js`, linhas 316 e 877.

**O que foi encontrado:** A função `initApp` está definida **duas vezes** no mesmo ficheiro. Em JavaScript, quando existem duas declarações `function` com o mesmo nome, a segunda sobrescreve a primeira (hoisting faz com que ambas sejam declaradas, mas a última vence).

```javascript
// Linha 316 — primeira definição (incompleta)
function initApp() {
  // ... regista event listeners, syncRunControls
  // NÃO tem: startTimer(), syncTimerPauseButton(), renderActiveExercise()
}

// Linha 877 — segunda definição (completa, vence)
function initApp() {
  // ... regista event listeners, syncRunControls
  // TEM: startTimer(), syncTimerPauseButton(), renderActiveExercise()
}
```

**Impacto:**
1. A segunda definição é a que corre (a app funciona), mas os event listeners são registados duas vezes quando o script é avaliado — embora o `DOMContentLoaded` só chame `initApp` uma vez, a duplicação cria confusão e risco de divergência futura.
2. Qualquer desenvolvedor que edite a primeira `initApp` pensando que é a "verdadeira" fará alterações que nunca terão efeito.

**Introduzido em:** Pelo menos desde o commit `78fc816` ("feat: add collapsible "Avançado" advanced-explanation section").

**Solução:** Remover a primeira definição de `initApp` (linhas 316–343), deixando apenas a segunda (linhas 877–907).

---

### 🟡 MÉDIO — `intro`: condição de validação ligeiramente inconsistente com o starter

**Ficheiro:** `assets/exercises/01-fundamentos.js`, linha 71.

**O que foi encontrado:** O `validate` verifica:
```javascript
state.panelColor !== '#3b93ff' || state.messageSize !== 44
```

O starter code chama `mudarCorPainel("#3b93ff")` e `mudarTamanhoMensagem(44)`. Quando o aluno corre o starter sem alterações, `state.panelColor === '#3b93ff'` e `state.messageSize === 44`, por isso **falha corretamente**.

No entanto, o controlo visual de cor tem `defaultValue: '#102033'` — se o aluno mudar manualmente o código do starter para `mudarCorPainel("#102033")` (o valor do controlo, não o do starter), o painel fica com outra aparência mas `state.panelColor === '#102033'` ≠ `'#3b93ff'`, por isso passa indevidamente sem usar os controlos visuais interativos.

**Impacto:** Baixo em contexto de aula (improvável este cenário), mas há uma janela de "bypass manual".

**Solução potencial:** A condição deveria ser baseada na diferença em relação ao starter **inicial**, não a um valor arbitrário. Por exemplo:
```javascript
state.panelColor !== '#3b93ff' || state.messageSize !== 44
```
é correto como está — o problema é que um aluno pode mudar o código para qualquer cor diferente de `#3b93ff` e passar. Isso é, na verdade, o comportamento **desejado**: o aluno só precisa de mudar algo. **Sem alteração necessária.**

**Estado: ⚠️ Comportamento aceitável. Sem ação necessária.**

---

### 🟢 BAIXO — `mvp-futebol`: regex de faltas frágil

**Ficheiro:** `assets/exercises/08-desafios.js`, linha 233.

**O que foi encontrado:** A validação verifica `/\*.*-?\s*2|-2\s*\*/.test(code)` para confirmar que as faltas são penalizadas com ×(−2). Esta regex é frágil:
- `faltas * -2` → ✅ capturado
- `faltas * (-2)` → ✅ capturado (o `.` captura `(`)  
- `-2 * faltas` → ❌ NÃO capturado (padrão alternativo `|-2\s*\*` captura se `-2 *`, mas não `-2*`)
- `faltas * 2 * -1` → ✅ capturado (mas é código não convencional)

Um aluno que escreva `-2*faltas` (sem espaço) pode não ser detetado pelo segundo alternativo da regex `|-2\s*\*` porque `\s*` requer espaço zero ou mais, mas a ordem é `-2` seguido de `\*`. Na verdade `|-2\s*\*` **captura** `-2*faltas`. **O problema real é `-2 * faltas` que não captura o espaço entre `-2` e `*`** mas na verdade `|-2\s*\*` permite `\s*` (zero espaços), então `-2*` é capturado, mas `-2 *` (com espaço) — verifica: `-2\s*\*` = `-2` + zero-ou-mais-espaços + `*`, ou seja `-2 *` **é capturado**. 

Após análise mais cuidadosa, a regex cobre os principais casos. O impacto é mínimo.

**Estado: ℹ️ Sem ação urgente.**

---

## Sumário de Prioridades — Actualizado

| Prioridade | Exercício/Ficheiro | Problema | Estado |
|---|---|---|---|
| ✅ | `intro` | Passava sem interação | **CORRIGIDO** |
| ✅ | `strings` | Promessa falsa sobre tipos TS | **CORRIGIDO** |
| ✅ | `semaforo-amarelo` | Bypass sem usar `estado` | **CORRIGIDO** |
| ✅ | `numeros-variavel` | Hardcode de `84` | **CORRIGIDO** |
| ✅ | `cesar` | Hardcode de `"SPbY"` | **CORRIGIDO** |
| ✅ | `arvore-procura` | Falso negativo `treeSteps <= listSteps` | **CORRIGIDO** |
| ✅ | `donatello-roomba` | Falha aleatória com código correto | **CORRIGIDO** |
| ✅ | `pi` (dardos) | Congelava PCs lentos | **CORRIGIDO** |
| ✅ | `grafo-caminho` | Ordem do caminho não explicada | **CORRIGIDO** |
| 🔴 **NOVO** | `main.js` | `initApp` definida duas vezes (dead code + risco) | **EM ABERTO** |
| 🟡 **NOVO** | `intro` | Bypass manual possível mas improvável | **ACEITÁVEL** |
| 🟢 **NOVO** | `mvp-futebol` | Regex de faltas ligeiramente frágil | **ACEITÁVEL** |
