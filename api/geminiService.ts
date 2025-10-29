import { GoogleGenAI } from "@google/genai";
import type { Complaint } from '../shared/types';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

export const getWeeklySummary = async (complaints: Complaint[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const recentComplaintsText = complaints
      .slice(0, 15) // Use the 15 most recent complaints for the summary
      .map(c => `- ${c.complaint_text} (Category: ${c.category}, Location: ${c.location})`)
      .join('\n');

    const prompt = `
      You are an expert urban policy analyst for an Indian Municipal Corporation.
      Your task is to provide a concise, actionable weekly summary based on recent citizen complaints from various Indian cities.
      Analyze the following list of complaints and generate a summary that includes:
      1.  **Top 3 Priority Issues:** Identify the three most urgent or recurring themes (e.g., Potholes, Garbage Collection, Waterlogging).
      2.  **Emerging Trends:** Note any new patterns or geographically concentrated issues in specific cities or localities.
      3.  **Actionable Recommendations:** Suggest concrete next steps for the relevant departments (e.g., "Instruct BBMP Public Works to inspect...", "Deploy additional sanitation crew to...").

      Format the output as clean, readable text. Do not use Markdown formatting like ### or **.

      Here are the complaints from the past week:
      ${recentComplaintsText}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini API:", error);
    return "Error: Could not generate AI-powered summary. Please check your API key and connection.";
  }
};