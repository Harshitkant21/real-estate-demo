# MITTALCO — Content Maintenance & Editorial Guide

This document explains how non-technical editorial staff and platform managers can maintain properties, developers, launches, and market news in **MITTALCO** without modifying React source code.

---

## 🏛️ Content Architecture Overview

Data in **MITTALCO** is separated into 5 clear categories:

1. **Editorial Content** (`src/data/`):
   - **Property Dossiers**: `src/data/properties.json`
   - **Master Developers**: `src/data/developers.json`
   - **Upcoming Launches**: `src/data/launches.json`
   - **Investment Hubs**: `src/data/areas.json`
   - **Verified News Wire**: `src/data/newsData.json`
   - **Advisor Profile**: `src/data/advisorData.json`

2. **Live Market Data** (`src/services/providers/`):
   - Ingested via `DLDTransactionProvider.ts` from official Dubai Land Department (DLD) open data portal.

3. **Live Exchange Rates** (`FXProvider.ts`):
   - Ingested from Open Exchange Rates FX API (AED base) with 12-hour local caching.

4. **Derived Intelligence** (`marketMetricsEngine.ts`):
   - Calculated deterministically from transaction volume momentum, rental yield benchmarks, and price growth indices.

5. **AI Interpretation** (`aiAdvisorService.ts`):
   - Generated on-demand using Mistral AI or NVIDIA NIM API with strict domain guardrails.

---

## 🔒 Zod Runtime Validation

At application startup, all datasets are validated using **Zod schemas** (`src/schemas/`). If mandatory fields are missing or wrongly formatted, the application will catch the error gracefully instead of crashing silently.
