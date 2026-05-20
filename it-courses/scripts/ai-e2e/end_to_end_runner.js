/**
 * ЛР4 — E2E через LLM-агента (browser-use / prompt-based)
 *
 * Залежності (окремо від основного проєкту):
 *   pip install browser-use playwright
 *   playwright install chromium
 *
 * Змінні середовища:
 *   GOOGLE_API_KEY або MISTRAL_API_KEY — для LLM
 *   BASE_URL=http://localhost:3000
 *
 * Запуск:
 *   node scripts/ai-e2e/end_to_end_runner.js --case catalog
 *   node scripts/ai-e2e/end_to_end_runner.js --case checkout
 *
 * Зразок: https://github.com/igor-pysmennyi-kpi/qa-ai-overview-paper-2025/blob/main/end_to_end_runner.py
 *
 * Цей файл — Node-обгортка з промптами для тих самих TC-E2E-01/02.
 * Повна browser-use інтеграція потребує Python; нижче — промпти + інструкція.
 */

const { spawn } = require('child_process');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const TEST_CASES = {
  catalog: {
    id: 'TC-E2E-01',
    description: 'Browse catalog and open course details',
    prompt: `
You are a QA automation agent testing ${BASE_URL}.

Goal: Verify catalog browse user flow.
Steps:
1. Open ${BASE_URL}/catalog
2. Wait until course cards (.course-card) appear in #technicalCourses and #nonTechnicalCourses
3. Click the first course card
4. Assert URL matches /course/\\d+
5. Assert #courseTitle is not "Course Title" and #coursePriceValue contains "$"
Report: PASS or FAIL with reasons.
`.trim(),
  },
  checkout: {
    id: 'TC-E2E-02',
    description: 'Complete checkout after buying a course',
    prompt: `
You are a QA automation agent testing ${BASE_URL}.

Goal: Verify purchase checkout flow.
Steps:
1. Open ${BASE_URL}/catalog, wait for .course-card, click first card
2. On course page wait for #courseTitle to load, click #buyButton
3. On checkout fill: email student@example.com, phone 0501234567,
   courseName from page title, cardNumber 4111111111111111
4. Click submit (Pay)
5. Assert redirect to /thank-you and heading contains "Thank you"
Report: PASS or FAIL with reasons.
`.trim(),
  },
};

function parseArgs() {
  const idx = process.argv.indexOf('--case');
  const caseName = idx >= 0 ? process.argv[idx + 1] : 'catalog';
  return caseName;
}

function printPrompt(caseName) {
  const tc = TEST_CASES[caseName];
  if (!tc) {
    console.error(`Unknown case: ${caseName}. Use: catalog | checkout`);
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log(`${tc.id}: ${tc.description}`);
  console.log('='.repeat(60));
  console.log('\n--- Prompt for LLM browser agent ---\n');
  console.log(tc.prompt);
  console.log('\n--- Python browser-use example ---\n');
  console.log(`# Save prompt to agent and run with browser-use + Gemini/Mistral API key`);
  console.log(`# See: qa-ai-overview-paper-2025/end_to_end_runner.py`);
}

function tryRunPythonAgent(caseName) {
  const runnerPy = path.join(__dirname, 'browser_use_runner.py');
  const child = spawn('python', [runnerPy, '--case', caseName], {
    stdio: 'inherit',
    env: process.env,
  });
  child.on('error', () => {
    console.log('\n(Python browser_use_runner.py not found — use prompt above manually.)');
  });
}

const caseName = parseArgs();
printPrompt(caseName);

if (process.argv.includes('--run-python')) {
  tryRunPythonAgent(caseName);
}
