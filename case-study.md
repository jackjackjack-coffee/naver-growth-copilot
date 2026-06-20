# Case Study: Seller Growth Copilot

## Problem

Seller consultants need to decide which sellers deserve attention each week, but raw dashboards make that workflow slow. The opportunity is to convert seller metrics into ranked consulting cases and AI-assisted weekly briefs.

## User

Primary user: a NAVER Shopping seller consultant or sales manager.

Core weekly jobs:

- Review seller performance across GMV, conversion, reviews, and advertising efficiency.
- Decide which sellers need a call or written guidance.
- Prepare concise, evidence-backed recommendations.
- Record which actions were accepted and whether they worked.

## Scope

The tool covers:

- Seller opportunity dashboard.
- Seller table and detail view.
- AI-generated weekly seller brief.
- Benchmarking notes from comparable sales, ecommerce, CRM, and BI tools.
- SQL-based opportunity scoring logic.
- Usability-test plan.

## Product thinking

The tool deliberately avoids a fully automated "black box" recommendation. Instead it gives consultants a ranked queue, visible metrics, editable report output, and a validation loop. That is more realistic for early AI adoption in a sales-support workflow, because field users need to trust and adjust the output before they rely on it.

## Data logic

The opportunity score combines:

- Growth gap.
- Conversion decline.
- Review risk.
- Advertising efficiency.
- Consulting readiness.

It is intentionally simple enough to explain in one sentence, but structured enough to rank sellers consistently across categories.

## What to validate

1. Can a consultant find the highest-priority sellers faster than with a spreadsheet?
2. Does the AI brief feel trustworthy because each recommendation is linked to a metric?
3. Can the consultant edit the seller-facing language without rewriting the whole note?
4. Which recommendation types are accepted or rejected in the field?

## Why it matters

The tool maps directly to a real seller-growth workflow:

- Ecommerce/platform seller growth.
- Internal sales-management tooling.
- AI report automation.
- Dashboard design.
- Benchmark research.
- Usability-test design.
