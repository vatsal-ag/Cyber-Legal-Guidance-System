const fs = require('fs');

const html = fs.readFileSync('cyber_legal_guidance_system.html', 'utf8');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  scriptIndex++;
  const attrs = match[1];
  const code = match[2];
  if (!code.trim()) continue;

  if (attrs.includes('application/ld+json')) {
    try {
      JSON.parse(code);
      console.log(`Script block #${scriptIndex} (JSON-LD): VALID JSON (${code.length} chars)`);
    } catch (err) {
      console.error(`Script block #${scriptIndex} (JSON-LD) ERROR:`, err.message);
      errors++;
    }
  } else {
    try {
      new Function(code);
      console.log(`Script block #${scriptIndex} (JavaScript): SYNTAX VALID (${code.length} chars)`);
    } catch (err) {
      console.error(`Script block #${scriptIndex} (JavaScript) ERROR:`, err.message);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log(`\nALL ${scriptIndex} SCRIPT BLOCKS HAVE ZERO SYNTAX ERRORS!`);
  process.exit(0);
} else {
  console.error(`\nFAILED WITH ${errors} ERRORS`);
  process.exit(1);
}
