#!/usr/bin/env python3
"""Create a markdown stub for a market regime debate report."""

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


def build_default_output(focus: str, now: datetime) -> Path:
    day_dir = Path.cwd() / "reports" / now.strftime("%Y-%m-%d")
    stem = slugify(focus)
    filename = f"{now.strftime('%Y%m%d-%H%M%S')}-market-regime-{stem}.md"
    return day_dir / filename


def is_korean(language: str) -> bool:
    return language.strip().lower().startswith("ko")


def localize_focus(focus: str, language: str) -> str:
    if not is_korean(language):
        return focus
    mapping = {
        "global plus korea": "글로벌·한국",
        "global": "글로벌",
        "korea": "한국",
        "us": "미국",
    }
    return mapping.get(focus.strip().lower(), focus)


def render_report(focus: str, language: str, now: datetime) -> str:
    timestamp = now.isoformat(timespec="minutes")
    display_focus = localize_focus(focus, language)
    if is_korean(language):
        title = f"{now.strftime('%Y년 %m월 %d일')} {display_focus} 경제와 금융시장 심층 보고서"
        return f"""---
title: "{title}"
focus: "{display_focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {title}

## 한눈에 보는 결론

[현재 시장 레짐이 위험선호, 방어, 또는 중립 중 어디에 가까운지 한 문단으로 직접 답하라. 짧은 메모처럼 끝내지 말고, 핵심 근거와 반대 조건까지 함께 적어라.]

## 이번 보고서의 기준과 범위

- 범위: `{display_focus}`
- 보고서 언어: `{language}`
- 분석 시각: `{timestamp}`

## 지금 먼저 봐야 할 숫자

- 주요 지수:
- 금리:
- 환율:
- 원자재:
- 가장 중요한 시장 반응:

## 세계 경제 큰 흐름

[세계 경제의 큰 방향을 길게 정리하라. 성장, 물가, 지정학, 무역, 정책 환경이 어떻게 맞물리는지 설명하라.]

## 미국 경제와 연준

[미국 성장, 고용, 물가, 소비, 제조업, 연준 스탠스를 자세히 정리하라. 단순 수치 나열이 아니라 시장에 왜 중요한지도 함께 설명하라.]

## 유럽 경제와 ECB

[유로존 성장과 물가, ECB 스탠스, 유럽 경기의 강점과 약점을 자세히 정리하라.]

## 중국 경제와 교역·원자재

[중국 경기, 부동산, 제조업, 수출입, 원자재 수요가 글로벌 시장에 주는 영향을 자세히 정리하라.]

## 일본 경제와 BOJ

[일본 경기와 물가, BOJ 정상화 경로, 엔화와 글로벌 자금 흐름에 미치는 영향을 정리하라.]

## 한국 경제 흐름

[한국 성장, 수출, 내수, 물가, 고용, 가계부채, 부동산, 정책당국 스탠스, 한국 자산시장에 중요한 배경을 자세히 정리하라.]

## 금리·환율과 자금 흐름

[미국 금리, 달러, 원/달러, 한국 금리, 유동성 상황과 자금 흐름이 시장에 어떤 압력을 주는지 자세히 설명하라.]

## 자산시장과 업종 흐름

[주식, 채권, 원자재, 금, 크레딧, 섹터 로테이션, 시장 폭, 스타일 리더십이 현재 레짐을 확인하는지 자세히 정리하라.]

## 반대 시나리오와 깨질 조건

[현재 판단을 빠르게 무너뜨릴 수 있는 리스크와 반전 조건을 자세히 적어라. 최소 4개 이상 정리하라.]

## 쟁점 정리와 증거 점검

[무엇이 검증된 사실인지, 무엇이 해석인지, 가장 큰 쟁점이 무엇인지, 토론 후 어떤 결론이 남았는지 자세히 정리하라.]

## 실전 판단과 대응

[지금 시장이 공격, 방어, 기다림 중 어디에 더 가까운지, 어떤 자산·업종에서만 제한적으로 공격이 가능한지, 무엇을 조심해야 하는지 분명하게 적어라.]

## 앞으로 확인할 일정과 지표

- 
- 
- 
- 

## 출처

- 
"""

    title = f"{focus} economy and market deep-dive report"
    return f"""---
title: "{title}"
focus: "{focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {title}

## Verdict At A Glance

[Write a direct answer about the current regime and whether it is risk-on, risk-off, mixed, or patience-first. Do not make this section too short.]

## Scope And Reference Frame

- Focus: `{focus}`
- Report language: `{language}`
- Analysis timestamp: `{timestamp}`

## Key Numbers And Immediate Market Reaction

- Major indexes:
- Rates:
- FX:
- Commodities:
- Immediate market reaction:

## Big Global Picture

[Write a substantial synthesis of the global macro backdrop.]

## United States And The Fed

[Explain growth, labor, inflation, and the Fed stance in depth.]

## Europe And The ECB

[Explain the euro area backdrop and the ECB stance in depth.]

## China, Trade, And Commodities

[Explain China, trade, and commodities in depth.]

## Japan And The BOJ

[Explain Japan and the BOJ in depth.]

## Korea Economy And Policy

[Explain Korea's growth, exports, domestic demand, inflation, labor, housing, and policy backdrop in depth.]

## Rates, FX, And Liquidity

[Explain how yields, the dollar, FX, and liquidity affect the tape.]

## Cross-Asset, Sectors, And Market Structure

[Explain whether cross-asset signals, sector leadership, and tape structure confirm or challenge the regime.]

## Bear Case And Break Conditions

[Explain the main fragilities and the most important reversal triggers in depth.]

## Debate Synthesis And Evidence Check

[Summarize what was verified, what remains interpretation, and what the biggest unresolved disagreement is.]

## Actionable Decision

[State whether the market currently favors offense, defense, or patience.]

## Watchlist

- 
- 
- 
- 

## Sources

- 
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create a market regime markdown stub.")
    parser.add_argument("--focus", default="global plus Korea", help="Market focus.")
    parser.add_argument("--language", default="en", help="Report language marker.")
    parser.add_argument("--output", help="Exact output file path.")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing file.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    now = datetime.now().astimezone()
    focus = args.focus.strip() or "global plus Korea"
    output_path = (
        Path(args.output).expanduser().resolve()
        if args.output
        else build_default_output(focus, now).resolve()
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if output_path.exists() and not args.overwrite:
        print(f"Refusing to overwrite existing file without --overwrite: {output_path}", file=sys.stderr)
        return 1

    output_path.write_text(render_report(focus, args.language.strip() or "en", now), encoding="utf-8")
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
