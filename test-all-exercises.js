const puppeteer = require('puppeteer');
const fs = require('fs');

async function runTests() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const report = [];
  report.push("# Relatório de Teste de Exercícios");
  report.push("");
  report.push("Este relatório contém os resultados da execução automática (simulando interação manual) de todos os exercícios.");
  report.push("");
  
  try {
    await page.goto('http://localhost:8080/');
    await page.waitForSelector('.exercise-item', { timeout: 10000 });
    
    // Evaluate in page context to get the list of exercises
    const curriculum = await page.evaluate(() => {
      return window.Curriculum.build().exercises;
    });

    console.log(`Found ${curriculum.length} exercises.`);

    for (const ex of curriculum) {
      console.log(`Testing exercise: ${ex.id}`);
      
      try {
          // Navigate to exercise
          await page.evaluate((id) => {
              const buttons = Array.from(document.querySelectorAll('.exercise-item'));
              const btn = buttons.find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${id}'`));
              if (btn) btn.click();
          }, ex.id);
          
          await new Promise(r => setTimeout(r, 500));
          
          // Inject correct solution code.
          await page.evaluate((solution) => {
              const editorEl = document.getElementById('editor');
              if (editorEl) {
                  editorEl.value = solution || "";
                  // trigger input event to update highlight and internal state
                  editorEl.dispatchEvent(new Event('input', { bubbles: true }));
              }
          }, ex.solution);

          // Click "Executar"
          await page.click('#runExerciseBtn');
          
          await new Promise(r => setTimeout(r, 1000));
          
          // Check feedback
          let passed = await page.evaluate(() => {
              const container = document.getElementById('feedback');
              return container && container.classList.contains('success');
          });

          if (!passed) {
              const feedbackMsg = await page.evaluate(() => {
                  const el = document.getElementById('feedback');
                  return el ? el.innerText : 'No feedback element';
              });
              report.push(`- **[BUG] Exercício ${ex.id}:** O código da \`solution\` falhou na validação. \n  *Mensagem:* ${feedbackMsg}`);
          }

          // Inject WRONG code (the starter code, or something definitely broken).
          await page.evaluate((starter) => {
              const editorEl = document.getElementById('editor');
              if (editorEl) {
                  editorEl.value = starter || "invalid_code();";
                  editorEl.dispatchEvent(new Event('input', { bubbles: true }));
              }
          }, ex.starter);

          await page.click('#runExerciseBtn');
          await new Promise(r => setTimeout(r, 1000));
          
          const passedWrong = await page.evaluate(() => {
              const container = document.getElementById('feedback');
              return container && container.classList.contains('success');
          });
          
          // if it passed, wait, if the starter code is supposed to pass (like intro might pass immediately) then we check
          if (passedWrong && ex.id !== 'intro' && ex.id !== 'adivinhar-numero') { 
              report.push(`- **[BUG] Exercício ${ex.id}:** O código \`starter\` (incorreto) foi validado como correto.`);
          }

      } catch (err) {
          console.error(`Error in exercise ${ex.id}:`, err);
          report.push(`- **[BUG] Exercício ${ex.id}:** Erro ao testar no navegador: ${err.message}`);
      }
    }
    
    // Write out the report.md as requested.
    let existing = "";
    if (fs.existsSync("report.md")) {
      existing = fs.readFileSync("report.md", "utf8") + "\n\n";
    }
    fs.writeFileSync('report.md', existing + report.join('\n'));
    console.log("Done. Wrote to report.md.");

  } catch (e) {
    console.error("Test suite failed:", e);
  } finally {
    await browser.close();
  }
}

runTests();
