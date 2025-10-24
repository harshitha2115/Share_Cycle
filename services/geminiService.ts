
import { GoogleGenAI, Type } from "@google/genai";
import { Donation, Request } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key would be set.
  console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const findDonationMatches = async (donations: Donation[], requests: Request[]) => {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }

  const model = "gemini-2.5-pro";

  const prompt = `
    You are an expert logistics coordinator for a charity called ShareCycle. 
    Your task is to intelligently match donated items with requests from people in need.

    Analyze the following two JSON lists: 'donations' and 'requests'. 
    Your goal is to find the best available donation for each request.

    **Matching Rules:**
    1.  **Prioritize Category:** An item's category must match the request's category.
    2.  **Analyze Descriptions:** Carefully read the donation description and the request's need description to find the best fit based on keywords, context, and implied needs.
    3.  **Exclusive Matching:** A single donation item can only be matched to one request. Choose the best request for each item.
    4.  **No Suitable Match:** If no donation is a good fit for a request, you must indicate that.

    **Input Data:**
    Donations: ${JSON.stringify(donations.map(d => ({id: d.id, category: d.category, description: d.description})))}
    Requests: ${JSON.stringify(requests.map(r => ({id: r.id, category: r.category, description: r.description})))}

    Respond with your matches. For each match, provide a confidence score (high, medium, or low) and a brief, clear reasoning for your choice.
  `;
  
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        requestId: { type: Type.STRING },
        donationId: { type: Type.STRING },
        confidence: { type: Type.STRING },
        reasoning: { type: Type.STRING },
      },
      required: ['requestId', 'donationId', 'confidence', 'reasoning'],
    },
  };
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const responseText = response.text.trim();
    if (!responseText) {
      throw new Error("Received an empty response from the AI.");
    }

    const matches = JSON.parse(responseText);

    // AI might match one donation to multiple requests. This ensures each donation is used once.
    const usedDonationIds = new Set<string>();
    const finalMatches: any[] = [];

    // Augment matches from AI with unmatched requests
    const allRequestIds = new Set(requests.map(r => r.id));
    const matchedRequestIds = new Set(matches.map((m: any) => m.requestId));

    for (const match of matches) {
        if (match.donationId && !usedDonationIds.has(match.donationId)) {
            finalMatches.push(match);
            usedDonationIds.add(match.donationId);
        } else if (match.donationId && usedDonationIds.has(match.donationId)) {
            // This donation was already used for a better match, so this request is now unmatched.
             finalMatches.push({
                requestId: match.requestId,
                donationId: null,
                confidence: null,
                reasoning: "A potential item was matched with a higher-priority request."
            });
        }
    }

    allRequestIds.forEach(reqId => {
        if (!matchedRequestIds.has(reqId)) {
            finalMatches.push({
                requestId: reqId,
                donationId: null,
                confidence: null,
                reasoning: "No suitable donation found in the current inventory."
            });
        }
    });

    return finalMatches;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get matches from the AI. Please check the console for details.");
  }
};