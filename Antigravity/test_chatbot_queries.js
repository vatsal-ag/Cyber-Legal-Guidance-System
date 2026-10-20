// Comprehensive test for CyberSahayakChatbot Indian & International Case Citations

const fs = require('fs');
const assert = require('assert');

// 1. Mock document and DOM
global.document = {
  getElementById: (id) => ({
    value: '',
    focus() {},
    scrollIntoView() {},
    classList: { add() {}, remove() {} }
  }),
  querySelectorAll: () => []
};

// 2. Extract objects from cyber_legal_guidance_system.html
const html = fs.readFileSync('cyber_legal_guidance_system.html', 'utf8');

function extractObject(name) {
  const match = html.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`));
  if (!match) throw new Error(`Could not extract ${name}!`);
  return new Function(`return {${match[1]}};`)();
}

const CASE_CITATIONS_DATA = extractObject('CASE_CITATIONS_DATA');
const INTERNATIONAL_CITATIONS_DATA = extractObject('INTERNATIONAL_CITATIONS_DATA');

// Extract findCaseCitationMatch
const matchFnMatch = html.match(/findCaseCitationMatch\(text\)\s*\{([\s\S]*?)\n  \},/);
if (!matchFnMatch) throw new Error("Could not extract findCaseCitationMatch!");

const findCaseCitationMatch = new Function('text', 'CASE_CITATIONS_DATA', 'INTERNATIONAL_CITATIONS_DATA', `
  ${matchFnMatch[1]}
`);

console.log("=== TEST SUITE: Cyber Law Codex Indian & International Citations ===");

// Test 1: Indian Case Matches
console.log("\n[Test 1] Testing Indian Landmark Case Matches...");
const indianQueries = [
  { q: "Tell me about Shreya Singhal case", key: "SHREYA_SINGHAL_2015", cat: "citations" },
  { q: "What is Arjun Khotkar 65B certificate ruling?", key: "ARJUN_KHOTKAR_2020", cat: "citations" },
  { q: "Explain Puttaswamy privacy judgment", key: "PUTTASWAMY_2017", cat: "citations" },
  { q: "Suhas Katti cyber harassment conviction", key: "SUHAS_KATTI_2004", cat: "citations" }
];

indianQueries.forEach(({ q, key, cat }) => {
  const result = findCaseCitationMatch(q, CASE_CITATIONS_DATA, INTERNATIONAL_CITATIONS_DATA);
  assert(result, `Expected match for query: "${q}"`);
  assert.strictEqual(result.cat, cat, `Expected category "${cat}" for "${q}"`);
  console.log(`✓ Matched Indian Case [${result.cat}]: "${q}" => ${result.title} (${result.citation})`);
});

// Test 2: International Case Matches
console.log("\n[Test 2] Testing International Landmark Case Matches...");
const intlQueries = [
  { q: "Tell me about Google Spain Right to be Forgotten", key: "GOOGLE_SPAIN_2014", cat: "intl" },
  { q: "What is Carpenter cell-site location privacy ruling?", key: "CARPENTER_2018", cat: "intl" },
  { q: "Explain Schrems II cross border data transfer", key: "SCHREMS_II_2020", cat: "intl" },
  { q: "Riley v California smartphone warrantless search", key: "RILEY_CALIFORNIA_2014", cat: "intl" },
  { q: "Is web scraping legal under hiQ v LinkedIn?", key: "HIQ_LINKEDIN_2022", cat: "intl" },
  { q: "Van Buren exceeding authorized access ruling", key: "VAN_BUREN_2021", cat: "intl" },
  { q: "Robert Morris first internet worm CFAA felony", key: "US_V_MORRIS_1991", cat: "intl" },
  { q: "Twitter Taamneh algorithm recommendation liability", key: "TWITTER_TAAMNEH_2023", cat: "intl" },
  { q: "Vidal Hall Safari workaround cookie tracking tort", key: "VIDAL_HALL_2015", cat: "intl" },
  { q: "Apple FBI San Bernardino iPhone encryption backdoor", key: "APPLE_SAN_BERNARDINO_2016", cat: "intl" },
  { q: "R v Gold Prestel British Telecom hack", key: "R_V_GOLD_1988", cat: "intl" },
  { q: "EncroChat encrypted phone police remote malware implant", key: "ENCROCHAT_2020", cat: "intl" }
];

intlQueries.forEach(({ q, key, cat }) => {
  const result = findCaseCitationMatch(q, CASE_CITATIONS_DATA, INTERNATIONAL_CITATIONS_DATA);
  assert(result, `Expected match for query: "${q}"`);
  assert.strictEqual(result.cat, cat, `Expected category "${cat}" for "${q}"`);
  assert(result.comparativeContext, `Expected comparativeContext connecting to Indian law for "${q}"`);
  console.log(`✓ Matched Global Precedent [${result.cat} - ${result.jurisdiction}]: "${q}" => ${result.title}`);
});

console.log("\n=================================================================");
console.log("🎉 ALL INDIAN & INTERNATIONAL CHATBOT CITATION TESTS PASSED!");
console.log("=================================================================");
