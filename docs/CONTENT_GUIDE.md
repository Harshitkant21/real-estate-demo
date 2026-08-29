# AM Estates — Content Maintenance Guide

This document explains how non-technical editorial staff and platform managers can add, edit, or remove properties, developers, launches, and investment hubs in **AM Estates** without modifying React source code.

---

## Content Architecture Overview

All core listings and reference datasets live in `src/data/`:

- **Properties**: `src/data/properties.json`
- **Developers**: `src/data/developers.json`
- **Upcoming Launches**: `src/data/launches.json`
- **Investment Areas**: `src/data/areas.json`
- **Demo Telemetry / Market Data**: `src/data/demoMarketData.json`

At application startup, all datasets are validated using **Zod schemas** (`src/schemas/propertySchema.ts`). If mandatory fields are missing or wrongly formatted, the application will display a clear error in development instead of crashing silently.

---

## 1. How to Add a New Property

Open `src/data/properties.json` and append a new JSON object following this structure:

```json
{
  "id": "ame-007",
  "name": "The Waterline Sky Residences",
  "developer": "Select Group",
  "area": "Dubai Marina",
  "propertyType": "Apartment",
  "startingPrice": 3200000,
  "currency": "AED",
  "bedrooms": 2,
  "bathrooms": 2.5,
  "sizeSqft": 1620,
  "paymentPlan": "60/40",
  "handover": "Q3 2028",
  "rentalYield": 7.1,
  "status": "Featured",
  "waterfront": true,
  "goldenVisaEligible": true,
  "media": {
    "heroImage": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "galleryImages": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ],
    "floorPlans": [
      {
        "title": "2 Bedroom Suite - Type A",
        "image": "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
        "bedrooms": 2,
        "sqft": 1620
      }
    ]
  },
  "thesis": {
    "whyInvest": "High rental demand corridor in prime waterfront Dubai Marina with immediate Golden Visa eligibility.",
    "growthDrivers": [
      "Waterfront marina access",
      "Limited remaining land supply in Marina",
      "High expat tenant yield history"
    ],
    "targetProfile": "Capital appreciation and steady rental income investors"
  },
  "risks": [
    "Construction timeline subject to handover milestones",
    "Seasonal occupancy variations"
  ]
}
```

### Key Field Rules:
- `startingPrice`: MUST be in **AED**. Currency conversion is handled automatically by the platform for USD, EUR, GBP, INR, and SAR.
- `waterfront`: `true` or `false`.
- `goldenVisaEligible`: `true` if starting price is AED 2,000,000 or above.
- `status`: Must be one of `"Featured"`, `"Off-Plan"`, `"Newly Launched"`, or `"Ready"`.

---

## 2. How to Add an Upcoming Project Launch

Open `src/data/launches.json` and add an entry:

```json
{
  "id": "launch-105",
  "name": "Orla Infinity",
  "developer": "Omniyat",
  "area": "Palm Jumeirah",
  "launchDate": "2026-09-15",
  "timeframe": "Next 30 Days",
  "startingPrice": 8500000,
  "paymentPlan": "50/50",
  "handover": "Q2 2029",
  "propertyType": "Luxury Penthouse",
  "expectedYield": 6.2,
  "status": "Upcoming VIP",
  "highlights": [
    "Managed by Dorchester Collection",
    "Private infinity pool terraces",
    "Unobstructed Sunset & Marina views"
  ],
  "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
}
```

---

## 3. Media & Image Performance Requirements

1. **Aspect Ratios**: Ensure hero images match **16:9** or **16:10** ratios for visual elegance.
2. **Quality & Formats**: Prefer optimized WebP URLs or Unsplash URLs with `auto=format&fit=crop&w=1600&q=80`.
3. **Dimensions**: Keep thumbnail images around 800px width and hero images around 1600px width to avoid heavy bandwith usage.

---

## 4. Validating Your JSON Changes

Run the project build locally to verify all JSON data validates against Zod schemas:

```bash
npm run build
```

If validation fails, check the console for specific line numbers and missing fields.
