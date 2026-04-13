#!/usr/bin/env python3
"""Create a markdown stub for a stock research debate report."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "report"


def build_default_output(ticker: str, company: str | None, now: datetime) -> Path:
    day_dir = Path.cwd() / "reports" / now.strftime("%Y-%m-%d")
    stem = slugify(company or ticker)
    filename = f"{now.strftime('%Y%m%d-%H%M%S')}-{ticker.lower()}-{stem}.md"
    return day_dir / filename


def is_korean(language: str) -> bool:
    return language.strip().lower().startswith("ko")


def render_report(
    ticker: str,
    company: str,
    horizon: str,
    risk_profile: str,
    language: str,
    now: datetime,
) -> str:
    timestamp = now.isoformat(timespec="minutes")
    analysis_date = now.date().isoformat()
    if is_korean(language):
        title = f"{company} 투자 토론 보고서"
        return f"""---
title: "{title}"
ticker: "{ticker}"
company: "{company}"
horizon: "{horizon}"
risk_profile: "{risk_profile}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {company} ({ticker}) 투자 토론 보고서

## 핵심 결론

[요청한 보유 기간 기준으로 이 종목이 매력적인지 한 문단으로 직접 답하라. 짧은 메모처럼 끝내지 말고 핵심 이유와 전제조건까지 함께 정리하라.]

## 요청 개요

- 종목: `{ticker}`
- 기업명: `{company}`
- 보유 기간: `{horizon}`
- 위험 성향: `{risk_profile}`
- 보고서 언어: `{language}`
- 분석 시각: `{timestamp}`
- 기준 시장 일자: `{analysis_date}`

## 기준 시점

[이 보고서가 어떤 거래일과 어떤 가격 스냅샷을 기준으로 쓰였는지 정확한 날짜와 함께 설명하라.]

## 시장 스냅샷

- 현재가:
- 가격 확인 시각:
- 시가총액:
- 밸류에이션 맥락:

## 기업 핵심 맥락

[사업 구조, 현재 시장이 이 회사를 어떻게 보고 있는지, 그리고 이번 투자 판단에서 무엇이 가장 중요한지 자세히 정리하라.]

## 목표 기간 내 촉매 지도

1. 
2. 
3. 

## 강세 논리

[상승 논리를 근거와 함께 자세히 설명하라. 무엇이 빠르게 재평가될 수 있는지, 무엇이 실제로 확인돼야 하는지도 포함하라.]

## 약세 논리

[하락 논리를 근거와 함께 자세히 설명하라. 강세론이 과소평가하는 리스크와 실패 경로를 분명히 적어라.]

## 토론 종합 및 증거 점검

[무엇이 검증된 사실인지, 무엇이 해석인지, 가장 큰 쟁점이 무엇인지, 토론 후 어떤 판단이 남았는지 자세히 정리하라.]

## 기술적 판단 및 실행 계획

- 기술적 위치:
- 지지:
- 저항:
- 지금 매수 조건:
- 눌림 매수 조건:
- 대기 조건:
- 분할 정리 또는 익절 조건:
- 매도 또는 철수 조건:
- 무효화 조건:

## 시나리오 표

| 시나리오 | 전제 | 핵심 동인 | 가격 함의 | 대략적 확률 |
| --- | --- | --- | --- | --- |
| 강세 |  |  |  |  |
| 기준 |  |  |  |  |
| 약세 |  |  |  |  |

## 요청 기간에 대한 최종 판단

[이 종목이 지금 적합한지, 더 기다려야 하는지, 아니면 피해야 하는지 분명하게 적어라.]

## 핵심 리스크 및 무효화 조건

- 
- 
- 

## 출처 로그

- 
"""

    title = f"{company} investment debate report"
    return f"""---
title: "{title}"
ticker: "{ticker}"
company: "{company}"
horizon: "{horizon}"
risk_profile: "{risk_profile}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {company} ({ticker}) Investment Debate Report

## Executive Verdict

[Write a direct answer about whether this setup looks attractive for the requested horizon.]

## Request Snapshot

- Ticker: `{ticker}`
- Company: `{company}`
- Holding period: `{horizon}`
- Risk profile: `{risk_profile}`
- Report language: `{language}`
- Analysis timestamp: `{timestamp}`
- Reference market date: `{analysis_date}`

## Today Reference Frame

[State exactly which trading date and price snapshot this report is anchored to.]

## Market Snapshot

- Current price:
- Price timestamp:
- Market cap:
- Valuation context:

## Company Context

[Summarize the core business, what the market cares about now, and what the company must prove.]

## Catalyst Map Within The Target Window

1. 
2. 
3. 

## The Bull Case

[Summarize the strongest upside case and what must go right.]

## The Bear Case

[Summarize the strongest downside case and what bulls may be underestimating.]

## Debate Synthesis And Evidence Check

[Explain what the debate changed, what is verified, what remains inference, and what the biggest unresolved disagreement is.]

## Technical And Execution Playbook

- Technical posture:
- Support:
- Resistance:
- Buy-now condition:
- Buy-on-pullback condition:
- Wait condition:
- Trim or take-profit condition:
- Sell or exit condition:
- Invalidation:

## Scenario Table

| Scenario | Assumptions | Expected Driver | Directional Price Implication | Approx. Probability |
| --- | --- | --- | --- | --- |
| Bull |  |  |  |  |
| Base |  |  |  |  |
| Bear |  |  |  |  |

## Decision For The Requested Horizon

[State whether the stock fits the requested horizon and risk posture now, later, or not at all.]

## Key Risks And Invalidation Triggers

- 
- 
- 

## Source Log

- 
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a stock research markdown stub.",
    )
    parser.add_argument("--ticker", required=True, help="Ticker symbol.")
    parser.add_argument("--company", help="Company name. Defaults to ticker.")
    parser.add_argument("--horizon", default="unspecified", help="Holding period.")
    parser.add_argument(
        "--risk-profile",
        default="unspecified",
        help="Risk posture such as aggressive or balanced.",
    )
    parser.add_argument(
        "--language",
        default="en",
        help="Report language marker such as en or ko.",
    )
    parser.add_argument(
        "--output",
        help="Exact output file path. Defaults to ./reports/<date>/timestamp-ticker-company.md",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite the output file if it already exists.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    now = datetime.now().astimezone()

    ticker = args.ticker.strip().upper()
    if not ticker:
        print("Ticker must not be empty.", file=sys.stderr)
        return 1

    company = (args.company or ticker).strip() or ticker
    output_path = (
        Path(args.output).expanduser().resolve()
        if args.output
        else build_default_output(ticker, company, now).resolve()
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if output_path.exists() and not args.overwrite:
        print(
            f"Refusing to overwrite existing file without --overwrite: {output_path}",
            file=sys.stderr,
        )
        return 1

    content = render_report(
        ticker=ticker,
        company=company,
        horizon=args.horizon.strip() or "unspecified",
        risk_profile=args.risk_profile.strip() or "unspecified",
        language=args.language.strip() or "en",
        now=now,
    )
    output_path.write_text(content, encoding="utf-8")
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
