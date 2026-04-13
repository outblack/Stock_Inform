# Source Policy

Use this file whenever the stock analysis depends on current data.

## Core Rule

Treat stock research as time-sensitive and high-stakes. Always browse current sources before making claims about price, valuation, recent events, leadership, guidance, regulation, technical posture, or momentum.

## Source Priority

Use sources in this order when possible:

1. company investor-relations pages, earnings releases, shareholder letters, presentation decks
2. SEC filings, exchange filings, or regulator filings
3. finance tool output and reliable market-data pages for price, market cap, and valuation snapshots
4. reputable news wires and business publications for recent developments
5. charting or technical-analysis pages as secondary support for trend context

If a claim can materially change the thesis, try to confirm it from at least two independent sources.

## Price Snapshot Rules

For the current price section, record:

- exact timestamp with timezone
- price and currency
- market or exchange when relevant
- source used

If prices differ slightly across sources, note the discrepancy and proceed with the most clearly timestamped source.

## Technical Analysis Rules

Prefer current, cited chart or table data over memory.

If exact indicator values such as RSI, MACD, moving averages, or support-resistance levels cannot be verified from current sources:

- say that the exact metric was not independently verified
- keep the technical read higher level
- avoid invented numeric precision

## Target Return Fit

If the user gives a desired return or deadline, judge whether it is plausible for the stated window.

Ask:

- what catalysts can occur inside the window
- how much rerating or estimate revision is required
- whether the implied upside depends on optimistic assumptions
- whether the downside path is larger than the plausible upside

If the target is unrealistic, say so directly.

## Fact Versus Judgment

Keep a visible distinction:

- `Fact`: directly supported by a cited current source
- `Inference`: reasoned conclusion drawn from one or more facts
- `Scenario`: conditional forecast that depends on assumptions

Do not present scenarios as facts.

## Conclusion Rules

The final report must:

- avoid personalized financial-advice language
- avoid certainty words such as `guaranteed`, `safe`, or `sure win`
- state the main reasons the thesis could fail
- mention what data would change the view
- cite sources inline or in a closing source log
