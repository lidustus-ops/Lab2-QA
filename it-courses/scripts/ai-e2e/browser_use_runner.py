"""
ЛР4 — LLM E2E runner (browser-use).

Встановлення:
  pip install browser-use langchain-google-genai playwright
  playwright install chromium

Змінні:
  GOOGLE_API_KEY=...   # або MISTRAL_API_KEY для іншого провайдера
  BASE_URL=http://localhost:3000

Запуск:
  python scripts/ai-e2e/browser_use_runner.py --case catalog
  python scripts/ai-e2e/browser_use_runner.py --case checkout

Перед запуском: npm start та npm run json-server
"""

from __future__ import annotations

import argparse
import asyncio
import os

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")

PROMPTS = {
    "catalog": f"""
Open {BASE_URL}/catalog. Wait for .course-card in technical and non-technical sections.
Click the first course card. Verify URL is /course/<number>.
Verify course title is loaded and price shows a dollar sign.
Say PASS or FAIL.
""",
    "checkout": f"""
Open {BASE_URL}/catalog, click first .course-card.
On course page click #buyButton. On checkout enter:
email student@example.com, phone 0501234567, card 4111111111111111,
course name from the course page. Submit the form.
Verify thank-you page. Say PASS or FAIL.
""",
}


async def run_agent(task: str) -> None:
    try:
        from browser_use import Agent
        from langchain_google_genai import ChatGoogleGenerativeAI
    except ImportError as exc:
        raise SystemExit(
            "Install: pip install browser-use langchain-google-genai playwright"
        ) from exc

    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise SystemExit("Set GOOGLE_API_KEY for Gemini (or adapt to Mistral).")

    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=api_key)
    agent = Agent(task=task, llm=llm)
    result = await agent.run()
    print(result)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--case", choices=PROMPTS.keys(), default="catalog")
    args = parser.parse_args()
    asyncio.run(run_agent(PROMPTS[args.case]))


if __name__ == "__main__":
    main()
