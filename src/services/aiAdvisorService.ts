import type { AIAdvisorResponse, Property } from '../types';
import { AIAdvisorResponseSchema } from '../schemas/aiSchema';
import { marketMetricsEngine } from './marketMetricsEngine';
import { APP_CONFIG } from '../config/appConfig';
import rawProperties from '../data/properties.json';

export class AIAdvisorService {
  private apiKey = APP_CONFIG.nvidiaApiKey;
  private endpoint = APP_CONFIG.nvidiaNimApiUrl;
  // Lightweight fast model for ultra-rapid execution speed
  private model = 'meta/llama-3.1-8b-instruct';

  public async queryAdvisor(userPrompt: string, budgetAED?: number): Promise<AIAdvisorResponse> {
    const promptLower = userPrompt.toLowerCase();

    // Guardrail check for domain relevance
    const isOffTopic =
      !promptLower.includes('dubai') &&
      !promptLower.includes('property') &&
      !promptLower.includes('invest') &&
      !promptLower.includes('yield') &&
      !promptLower.includes('rent') &&
      !promptLower.includes('villa') &&
      !promptLower.includes('apartment') &&
      !promptLower.includes('aed') &&
      !promptLower.includes('price') &&
      !promptLower.includes('palm') &&
      !promptLower.includes('creek') &&
      !promptLower.includes('downtown');

    if (isOffTopic) {
      return AIAdvisorResponseSchema.parse({
        marketView: 'Out of Domain Query',
        confidence: 100,
        summary:
          'AM Intelligence is strictly dedicated to Dubai real estate investment, DLD market telemetry, yield modeling, and property dossiers. Please ask a property or investment question.',
        drivers: ['Dubai Real Estate Scoping Guardrail'],
        risks: ['Non-property questions are redirected'],
        recommendedAreas: [],
        recommendedProperties: [],
        sources: ['AM Estates Domain Scoping Module'],
        generatedAt: new Date().toISOString().split('T')[0],
      });
    }

    const derivedScore = marketMetricsEngine.calculateDerivedScore();
    const effectiveBudget = budgetAED || 2500000;
    const suitableProps = (rawProperties as Property[]).filter((p) => p.startingPrice <= effectiveBudget * 1.25);
    const recommendedPropNames = suitableProps.slice(0, 2).map((p) => p.name);
    const recommendedAreas = Array.from(new Set(suitableProps.map((p) => p.area)));

    // Attempt live NVIDIA NIM API call if API key is present
    if (this.apiKey.trim()) {
      try {
        const systemPrompt = `You are AM Intelligence, an elite Dubai private wealth real estate advisor.
Analyze the user's inquiry based on official Dubai Land Department (DLD) market data:
- DLD Market Score: ${derivedScore.overallScore}/100 (${derivedScore.outlook})
- DLD Price Index Growth: +${derivedScore.priceMomentumPercent}% YoY
- Transaction Volume Index: +${derivedScore.transactionVolumeYoY}% YoY
- Target Budget: AED ${effectiveBudget.toLocaleString()}

Available Dossiers in budget: ${recommendedPropNames.join(', ')}

Return ONLY valid JSON matching this exact structure:
{
  "marketView": "Dubai Real Estate Market (Outlook)",
  "confidence": 95,
  "summary": "Concise high-value investor insight paragraph...",
  "drivers": ["Growth driver 1", "Growth driver 2", "Growth driver 3"],
  "risks": ["Risk consideration 1", "Risk consideration 2"],
  "recommendedAreas": ["Area 1", "Area 2"],
  "recommendedProperties": ["Property 1"],
  "sources": ["Dubai Land Department (DLD) Open Data", "NVIDIA NIM AI Reasoning Engine"],
  "generatedAt": "${new Date().toISOString().split('T')[0]}"
}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.4,
            max_tokens: 1024,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            // Clean markdown code blocks if present
            const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedJson = JSON.parse(cleanedContent);
            return AIAdvisorResponseSchema.parse(parsedJson);
          }
        }
      } catch (err) {
        console.warn('NVIDIA NIM API call failed or timed out, using validated DLD fallback:', err);
      }
    }

    // Fallback response if API key is not present or call fails
    const rawFallback = {
      marketView: `Dubai Real Estate Market (${derivedScore.outlook} - Score ${derivedScore.overallScore}/100)`,
      confidence: 92,
      summary: `Based on official Dubai Land Department (DLD) transaction telemetry showing +${derivedScore.priceMomentumPercent}% YoY price momentum, an investment allocation around AED ${(effectiveBudget / 1000000).toFixed(1)}M captures strong net rental yields (6.8% - 7.8% p.a.) in prime growth corridors.`,
      drivers: [
        `DLD sales volume up +${derivedScore.transactionVolumeYoY}% YoY`,
        `Golden Visa 10-year residency eligibility for properties starting at AED 2,000,000`,
        `Strong expat tenant absorption in waterfront & golf community corridors`,
      ],
      risks: [
        `Construction milestone timelines vary by developer phase`,
        `Short-term holiday home seasonal occupancy variations`,
      ],
      recommendedAreas: recommendedAreas.slice(0, 3),
      recommendedProperties: recommendedPropNames,
      sources: derivedScore.dataSources,
      generatedAt: new Date().toISOString().split('T')[0],
    };

    return AIAdvisorResponseSchema.parse(rawFallback);
  }
}

export const aiAdvisorService = new AIAdvisorService();
