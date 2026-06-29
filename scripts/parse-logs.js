const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:\\Users\\welli\\.gemini\\antigravity-ide\\brain\\ea506c71-7afe-480f-a925-64c160253181\\.system_generated\\logs\\transcript_full.jsonl'),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    // Print step 275, 276, 277, 278, etc. from subagent's run or main run
    if (obj.step_index >= 200 && obj.step_index <= 285) {
      console.log(`=== STEP ${obj.step_index} (Source: ${obj.source}, Type: ${obj.type}) ===`);
      console.log(JSON.stringify(obj.tool_calls || obj.content || '').substring(0, 1500));
    }
  } catch (e) {
    // ignore
  }
});
