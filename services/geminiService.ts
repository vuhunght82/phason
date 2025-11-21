import { GoogleGenAI, Type } from "@google/genai";
import { Formula, GlassThickness } from '../types';
import { BASE_COLORS } from '../constants';

const baseColorNames = BASE_COLORS.map(c => c.name);

// Dynamically create schema properties for all base colors
const schemaProperties = baseColorNames.reduce((acc, color) => {
    acc[color] = {
        type: Type.NUMBER,
        description: `The percentage of ${color} paint required. Should be 0 if not used.`,
    };
    return acc;
}, {} as Record<string, { type: Type, description: string }>);

export async function getPaintFormula(
    colorName: string, 
    colorHex: string | undefined, 
    compensateForGlass: boolean,
    glassThickness: GlassThickness,
    apiKey: string
): Promise<Formula> {
  
  if (!apiKey) {
    throw new Error("API key is required.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    let prompt = `You are an expert paint mixing chemist. Your task is to provide a precise mixing formula to create the color "${colorName}"${colorHex ? ` with the hex code ${colorHex}` : ''}.
      You must use only the following available base colors: ${baseColorNames.join(', ')}.
      The formula must be represented as percentages. The sum of all percentages in the formula must equal 100.
      If a base color is not needed, its value must be 0.`;
      
    if (compensateForGlass) {
        prompt += `\n\nIMPORTANT CONTEXT: This paint will be applied onto standard clear float glass used in construction. The selected glass thickness is ${glassThickness}mm.
This type of glass has a natural, subtle green tint due to its iron oxide (FeO) content, and this tint is more pronounced in thicker glass.
The generated formula MUST compensate for this green tint based on the specified thickness. A thicker glass (e.g., 10mm) requires more color correction than a thinner one (e.g., 3mm). The goal is for the final appearance of the color *after being applied to the ${glassThickness}mm glass* to match the target color "${colorName}" (${colorHex}). The paint itself in liquid form might need a slight tint adjustment (e.g., adding a bit of its complementary color, magenta/red) to neutralize the glass's green cast. Your final formula should reflect this professional adjustment.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formula: {
              type: Type.OBJECT,
              description: "An object where keys are the base color names and values are their percentage contribution.",
              properties: schemaProperties,
            },
            totalPercentage: {
                type: Type.NUMBER,
                description: "The sum of all percentages in the formula. This must be exactly 100."
            }
          },
          required: ["formula", "totalPercentage"],
        },
        temperature: 0.2,
      },
    });

    const textResponse = response.text?.trim();
    if (!textResponse) {
        throw new Error("Received an empty response from the API.");
    }
    
    const parsedJson = JSON.parse(textResponse);

    if (Math.round(parsedJson.totalPercentage) !== 100) {
        console.warn(`API returned a total percentage of ${parsedJson.totalPercentage}, which is not 100.`);
    }

    if (!parsedJson.formula || typeof parsedJson.formula !== 'object') {
        throw new Error("Invalid formula format in API response.");
    }

    return parsedJson.formula as Formula;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to get paint formula from AI for color: ${colorName}`);
  }
}