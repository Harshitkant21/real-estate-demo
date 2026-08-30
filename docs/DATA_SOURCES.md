# MITTALCO — Data Sources & Telemetry Catalog

This document details the origin, refresh policy, update frequency, licensing status, and fallback mechanics for all data streams used within the **MITTALCO** platform.

---

## 🏛️ Comprehensive Data Classification Matrix

| Dataset / Module | Source Classification | Location / Provider | Update Frequency | Fallback Mechanics | Server Credentials Required? | Data Status Metadata Badge |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dubai Land Department (DLD) Index** | **Authoritative Live** | `dldMarketApi.ts` (`dldBenchmarkData.json`) | Daily Open API Feed | Validated local DLD baseline | No (Public Open Domain) | `Authoritative Live` |
| **Exchange Rate FX Stream** | **Licensed Live** | `currencyApi.ts` (`open.er-api.com`) | 12-Hour Edge Cache | Pre-configured AED static rates | No (Public endpoint) | `Live FX` / `Cached 12h` / `Fallback` |
| **Properties Dossiers** | **Editorial Static** | `src/data/properties.json` | Build-time / Editorial | Build fails if Zod schema invalid | None | `Editorial / Verified` |
| **Developer Profiles** | **Editorial Static** | `src/data/developers.json` | Build-time / Editorial | Static JSON fallback | None | `Editorial / Verified` |
| **Launch Radar** | **Editorial Static** | `src/data/launches.json` | Build-time / Editorial | Static JSON fallback | None | `Editorial / Verified` |
| **Derived Market Scoring** | **Derived Intelligence** | `src/services/marketMetricsEngine.ts` | Calculated On-demand | Deterministic weighted scoring algorithm | None | `Derived Score` |
| **Mittalco Intelligence Analyst** | **AI Interpretation** | `src/services/aiAdvisorService.ts` (NVIDIA NIM / Mistral API) | Interactive On-demand | Contextual DLD summary with Zod validation | **Yes** (Server Proxy Only) | `AI Reasoning` |

---

## 1. Authoritative Live Data: Dubai Land Department (DLD) & Dubai Pulse

- **Source Agency**: Dubai Land Department (DLD) / Dubai Pulse Open Data Portal
- **Key Metrics**: Daily Residential Sales Transaction Index, 24-hour Sales Volume, Average Price per Square Foot by Dubai Community, Rental Absorption Rates.
- **Licensing & Access**: Public Open Domain Data.
- **Normalization**: Ingested via `dldMarketApi.ts` and validated against `DLDTransactionRecordSchema` (Zod).

---

## 2. Derived Intelligence Layer: Deterministic Scoring Engine

- **Source**: `src/services/marketMetricsEngine.ts`
- **Calculation Formula**:
  $$\text{Weighted Score} = (0.35 \times \text{TransactionVolumeYoY}) + (0.35 \times \text{PriceIndexGrowth}) + (0.30 \times \text{RentalYieldScore})$$
- **Rule**: AI reasoning models explain this score but NEVER invent factual market numbers.

---

## 3. AI Reasoning Layer: Environment-Driven Provider Service

- **Providers**: NVIDIA NIM (`meta/llama-3.1-8b-instruct`) / Mistral AI APIs via `aiAdvisorService.ts`
- **Security Boundary**: Client $\rightarrow$ Secure Edge Proxy $\rightarrow$ Provider Endpoint $\rightarrow$ Zod `AIAdvisorResponseSchema` Validation $\rightarrow$ UI.
- **Domain Scoping Guardrail**: Scoped strictly to UAE/Dubai real estate, DLD telemetry, yield calculations, and MITTALCO dossiers. Refuses out-of-domain queries.
