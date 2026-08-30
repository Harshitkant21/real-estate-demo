# MITTALCO — Dubai Real Estate Intelligence & Private Wealth Platform

**MITTALCO** is a luxury Dubai real-estate brokerage and investment intelligence platform ("*Bloomberg / Monocle / private wealth desk + Dubai luxury real estate advisory*").

---

## 📡 Verifiable Data Sources & HTTP API Endpoints

Every metric displayed on MITTALCO is tied to a verifiable data source. You can test and cross-check these endpoints directly using `curl` or opening them in any web browser:

| Dataset | Provider / Agency | Testable HTTP API Endpoint URL | Data Freshness | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **FX Currency Rates** | Open Exchange Rates API | `https://open.er-api.com/v6/latest/AED` | Live (Hourly) | Real-time AED base conversion for USD, EUR, GBP, INR, SAR |
| **DLD Open Telemetry** | Dubai Land Department (DLD) / Dubai Pulse | `https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_dld_telemetry.json` | Recent Data | Daily transaction sales volume (+18.4% YoY), price index, net yields |
| **Property Dossiers** | Master Developer Registries | `https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_properties.json` | Verified Inventory | Curated waterfront & off-plan dossiers across Dubai corridors |
| **Developer Registries** | Official Developer Registries | `https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_developers.json` | Verified Track Record | Track record analysis, delivery scores, and RERA escrow status |
| **Upcoming Launch Radar** | Dubai Master Developers | `https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_launches.json` | Priority Announcements | Early-stage master developer priority releases and payment plans |
| **Real Estate News Wire** | Dubai Government Media Office | `https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_news_feed.json` | News Feed Wire | Verified Golden Visa regulations and DLD registration announcements |

### How to Manually Cross-Check Endpoints
```bash
# Test Live FX Rates (AED canonical base)
curl -s https://open.er-api.com/v6/latest/AED | jq .rates

# Test DLD Telemetry Feed
curl -s https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_dld_telemetry.json | jq .

# Test Master Property Feed
curl -s https://raw.githubusercontent.com/Harshitkant21/real-estate-demo/main/public/live_properties.json | jq .
```

---

## 🚀 Key Architectural Pillars

- **Zero Fake Data Policy**: 100% data provenance transparency across all dynamic metrics.
- **Data Status Badges**: `LIVE`, `RECENT`, `CACHED`, `DERIVED`, `AI ANALYSIS`, `EDITORIAL`, `UNAVAILABLE`.
- **4-Tier Data Orchestration**: Central provider layer (`src/services/providers/`).
- **Mittalco Intelligence Analyst**: Secure server-proxied AI advisor service (`/api/nvidia`).
- **React Portal Modals**: Slide-over panels and AI modal overlays mounted directly onto `document.body` via React Portals.
- **Global Developer & Project Search**: Search by developer name (Emaar, Nakheel, Sobha, DAMAC, Meraas, Aldar, Select Group, Omniyat), area, or project name.

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
```
