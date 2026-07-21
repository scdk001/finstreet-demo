# Concierge → Broker Portal Integration

## Current Demo Integration Mode

The GitHub Pages concierge and the hosted Broker Portal are on different origins and cannot share browser storage. The prototype therefore uses a fixed fictional application identifier:

```text
FSA-2026-00127
```

The A button opens a static-host-safe bootstrap URL:

```text
https://finstreet-ai-lending-platform.hugosentinal1993.chatgpt.site/#/handoff?applicationId=FSA-2026-00127&mode=prototype-handoff
```

The platform then performs a client-side handoff to the canonical review route:

```text
/broker/applications/FSA-2026-00127/review?mode=prototype-handoff
```

Only the identifier and a non-sensitive prototype-mode flag are transmitted. The Broker Portal maps that identifier to a preconfigured fictional intake case and displays `Prototype data handoff`.

## Production design

```text
Concierge
  → POST /v1/applications/intake
  → Shared Application Service
  → encrypted database + document storage
  → applicationId + short-lived one-time handoff token
  → Broker Portal
  → POST /v1/handoffs/exchange
  → authorised application response
```

Required controls:

- Never put borrower names, income, addresses, identity numbers, documents or application JSON in a URL.
- Use a short-lived, single-use, signed handoff token bound to the application, intended portal, user/session and expiry time.
- Require Broker authentication, MFA and server-side role/tenant authorisation before returning application data.
- Encrypt data and documents in transit and at rest using Australian-hosting options agreed with FINSTREET.
- Maintain immutable create, read, amendment, submission and token-exchange audit events.
- Apply malware scanning, file-type validation, retention, consent and deletion policies.
- Separate Concierge, Broker and Lender permissions; never expose lender-only notes to brokers or applicants.
- Route OCR and LLM calls through governed service adapters with policy-version and source-citation records.

## Service adapters

- `mockAIService`: prototype conversation parsing; replace with governed LLM/orchestration API.
- `documentExtractionService`: prototype file classification; replace with secure upload, OCR and extraction jobs.
- `applicationService`: browser draft and fictional ID; replace with shared application API and database.
- `portalHandoffService`: ID-only link; replace with one-time token creation and exchange.
