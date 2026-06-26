// QA Automation Script for Verão ULisboa Laboratório de Programação (Version 2 - Race-free)
(async () => {
  console.log("Starting QA Automation Runner (Version 2)...");
  
  // 1. Reset progress in localStorage to start fresh
  appState.completed = {};
  appState.failed = {};
  appState.score = 0;
  saveState();
  renderExerciseList();
  renderActiveExercise();
  
  const { exercises } = Curriculum.build();
  const results = [];
  
  // Custom terminal input provider
  function getTerminalInputValue(exerciseId, promptText) {
    promptText = (promptText || "").toLowerCase();
    if (exerciseId === 'adivinhar-numero') {
      return String(window.exerciseState.secret || "25");
    }
    if (exerciseId === 'calculadora-interativa') {
      if (promptText.includes("primeiro")) return "15";
      return "10";
    }
    if (exerciseId === 'cifra-interativa') {
      return "mensagemsecreta";
    }
    if (exerciseId === 'falar') {
      if (promptText.includes("chamas")) return "Ana";
      return "gosta de astronomia";
    }
    if (exerciseId === 'while') {
      if (!window.whileCounter) window.whileCounter = 0;
      window.whileCounter++;
      if (window.whileCounter === 1) return "não";
      return "sim";
    }
    if (exerciseId === 'palavra-passe') {
      return "segredo123"; // 10 chars -> forte
    }
    if (exerciseId === 'arquiteto') {
      if (promptText.includes("número de pontos") || promptText.includes("numero de pontos")) return "2";
      if (promptText.includes("ponto 1 - x")) return "0";
      if (promptText.includes("ponto 1 - y")) return "0";
      if (promptText.includes("ponto 2 - x")) return "3";
      if (promptText.includes("ponto 2 - y")) return "4";
      return "0";
    }
    if (exerciseId === 'mvp-futebol') {
      if (promptText.includes("número de jogadores") || promptText.includes("numero de jogadores")) return "2";
      if (promptText.includes("nome do jogador 1")) return "Cristiano";
      if (promptText.includes("nome do jogador 2")) return "Messi";
      if (promptText.includes("golos")) return "10";
      if (promptText.includes("assistências") || promptText.includes("assistencias")) return "5";
      if (promptText.includes("desarmes")) return "3";
      if (promptText.includes("faltas")) return "2";
      return "0";
    }
    return "1";
  }

  // Intercept request-input from iframe/terminal
  const originalHandlePreviewMessage = window.handlePreviewMessage;
  window.handlePreviewMessage = function(event) {
    const msgType = event.data?.type;
    if (msgType === 'request-input') {
      // We are in terminal exercise. Provide mock input after a short delay.
      setTimeout(() => {
        const exercise = getActiveExercise();
        const promptText = document.getElementById('consoleStatus').textContent;
        const value = getTerminalInputValue(exercise.id, promptText);
        
        // Echo input in terminal
        TerminalPanel.append('▸ ' + value, 'input-echo');
        const form = document.getElementById('consoleForm');
        const status = document.getElementById('consoleStatus');
        const input = document.getElementById('consoleInput');
        form.hidden = true;
        status.textContent = '';
        input.value = '';
        
        // Send back to iframe
        document.getElementById('preview').contentWindow.postMessage({ type: 'provide-input', value }, '*');
      }, 50);
      return;
    }
    // Call original
    originalHandlePreviewMessage(event);
  };

  // Promise-based execution management
  let deferredResolve = null;
  const originalHandleStudentCodeResult = window.handleStudentCodeResult;
  window.handleStudentCodeResult = function(data) {
    originalHandleStudentCodeResult(data);
    if (deferredResolve) {
      deferredResolve(data);
    }
  };

  async function selectExerciseAndWait(topicId, exerciseId) {
    return new Promise((resolve) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          deferredResolve = null;
          resolve(null);
        }
      }, 3000);
      
      deferredResolve = (data) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(data);
        }
      };
      
      selectExercise(topicId, exerciseId);
    });
  }

  async function runCodeAndWait(code, exercise) {
    return new Promise((resolve) => {
      let resolved = false;
      
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          deferredResolve = null;
          resolve({ type: 'timeout', message: 'Execution timed out' });
        }
      }, exercise.id.includes('donatello') || exercise.id === 'pi' ? 18000 : 5000);
      
      deferredResolve = (data) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(data);
        }
      };
      
      // Set code
      getEditor().value = code;
      getEditor().dispatchEvent(new Event('input'));
      
      // Run
      runStudentCode(true);
    });
  }
  
  // Test all exercises one by one
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const topicId = getTopicIdForExercise(ex.id);
    
    console.log(`Running exercise ${i+1}/${exercises.length}: ${ex.id}`);
    
    // Select the exercise and wait for initial load run to complete
    await selectExerciseAndWait(topicId, ex.id);
    await new Promise(r => setTimeout(r, 100));
    
    // 1. Run Starter Code
    let starterResult = 'skipped';
    let starterMsg = '';
    if (ex.starter !== undefined) {
      window.whileCounter = 0;
      lastRunState = {};
      
      await runCodeAndWait(ex.starter, ex);
      
      const isCompleted = Boolean(appState.completed[ex.id]);
      starterResult = isCompleted ? 'pass (BUG: starter code shouldn\'t pass!)' : 'fail (correct behavior)';
      starterMsg = document.getElementById('feedback').textContent;
    }
    
    // 2. Run Solution Code
    let solutionResult = 'skipped';
    let solutionMsg = '';
    if (ex.solution !== undefined) {
      window.whileCounter = 0;
      lastRunState = {};
      
      await runCodeAndWait(ex.solution, ex);
      
      const isCompleted = Boolean(appState.completed[ex.id]);
      solutionResult = isCompleted ? 'pass' : 'fail';
      solutionMsg = document.getElementById('feedback').textContent;
    }
    
    results.push({
      id: ex.id,
      title: ex.title,
      starterResult,
      starterMsg,
      solutionResult,
      solutionMsg
    });
    
    // Small delay between exercises
    await new Promise(r => setTimeout(r, 100));
  }
  
  // Restore original handlers
  window.handlePreviewMessage = originalHandlePreviewMessage;
  window.handleStudentCodeResult = originalHandleStudentCodeResult;
  
  // Put the results on window so the browser agent can fetch it
  window.qaResults = results;
  console.log("QA Automation Runner finished!");
})();
