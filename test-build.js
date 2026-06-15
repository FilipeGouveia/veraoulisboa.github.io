// Test what buildDocument produces
globalThis.window = globalThis;
globalThis.window.AppUtils = { 
  stripTypeScript: (s) => s.replace(/:\s*(string|number|boolean|any)\b/g, ''),
  escapeHtml: (s) => s,
  formatText: (s) => s 
};

require('./assets/app/preview.js');

const exercise = {
  html: '<main><h1>Test</h1></main>',
  api: 'function test() {}',
  interactive: false,
};

const result = window.PreviewBuilder.buildDocument(exercise, 'console.log("hello")');
console.log('=== FIRST 500 CHARS ===');
console.log(result.substring(0, 500));
console.log('=== CONTAINS baseCss? ===');
console.log('Has @import:', result.includes('@import'));
console.log('Has literal ${baseCss}:', result.includes('${baseCss}'));
console.log('Has <style>:', result.includes('<style>'));
console.log('Has function test:', result.includes('function test'));
console.log('Has console.log:', result.includes('console.log'));
