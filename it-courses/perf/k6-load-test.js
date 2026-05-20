/**
 * ЛР3 — навантажувальне тестування (k6)
 *
 * Встановлення k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
 *
 * Запуск (Express має працювати на :3000):
 *   k6 run perf/k6-load-test.js
 *   k6 run -e SCENARIO=stress perf/k6-load-test.js
 *   k6 run -e SCENARIO=spike perf/k6-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SCENARIO = __ENV.SCENARIO || 'ramp'; // ramp | stress | spike

const pageDuration = new Trend('page_duration', true);

function requestPages() {
  const paths = ['/', '/catalog', '/course/1', '/checkout'];
  for (const path of paths) {
    const res = http.get(`${BASE_URL}${path}`);
    check(res, {
      [`${path} status 200`]: (r) => r.status === 200,
    });
    pageDuration.add(res.timings.duration);
  }
  sleep(0.3);
}

const scenarios = {
  ramp: {
    ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 25 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  stress: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '1m', target: 300 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  spike: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '5s', target: 150 },
        { duration: '30s', target: 150 },
        { duration: '5s', target: 5 },
        { duration: '20s', target: 5 },
      ],
    },
  },
};

export const options = {
  scenarios: scenarios[SCENARIO] || scenarios.ramp,
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(50)<500', 'p(95)<2000'],
  },
};

export default function () {
  requestPages();
}

export function handleSummary(data) {
  const med = data.metrics.http_req_duration?.values?.med;
  const std = data.metrics.http_req_duration?.values?.stddev;
  const failedPct = ((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2);

  const summary = `
=== K6 Load Test Summary (${SCENARIO}) ===
Base URL: ${BASE_URL}
VUs max: ${data.metrics.vus_max?.values?.max ?? 'n/a'}
HTTP req failed rate: ${failedPct}%
Median response time (ms): ${med ?? 'n/a'}
Std dev (ms): ${std ?? 'n/a'}
p95 (ms): ${data.metrics.http_req_duration?.values?.['p(95)'] ?? 'n/a'}
`;

  return {
    stdout: summary,
    'perf/k6-summary.json': JSON.stringify(data, null, 2),
  };
}
