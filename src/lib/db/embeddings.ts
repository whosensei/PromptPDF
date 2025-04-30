import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEmbeddings(text: string) {
    try {
        text = text.replace(/\n/g, " ")
        const result = await ai.models.embedContent({
            model: 'gemini-embedding-exp-03-07',
            contents: 'What is the meaning of life?',
            config: {
                taskType: "RETRIEVAL_DOCUMENT, RETRIEVAL_QUERY, QUESTION_ANSWERING, and FACT_VERIFICATION",
            }
          });
          console.log(result.embeddings);
          console.log(result.embeddings?.values);
          return result.embeddings?.values
    } catch (error) {
        console.error("error getting Gemini embeddings", error);
        throw error;
    }
}
