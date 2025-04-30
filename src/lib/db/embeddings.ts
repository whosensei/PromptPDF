import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEmbeddings(text: string) {
    try {
        const result = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: text.replace(/\n/g, " ") ,
            config: { outputDimensionality: 10 },
          });
          console.log(result.embeddings);
          console.log(result.embeddings?.values);
          return result.embeddings?.values
    } catch (error) {
        console.error("error getting Gemini embeddings", error);
        throw error;
    }
}
