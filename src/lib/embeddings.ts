import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEmbeddings(text: string, taskType: string = "RETRIEVAL_QUERY"): Promise<number[] | null> {
    try {
        text = text.replace(/\n/g, " ");
        
        if (text.length > 5000) {
            text = text.substring(0, 5000);
        }
        
        console.log(`Requesting embeddings for text of length ${text.length} with task type: ${taskType}`);
        
        const result = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: [text],
            config: {
                taskType: taskType,
                outputDimensionality: 768 // Using recommended smaller dimension for efficiency
            }
        });
        
        console.log('Embeddings result received:', JSON.stringify(result, null, 2).substring(0, 200) + '...');
        
        if (result.embeddings && Array.isArray(result.embeddings) && result.embeddings.length > 0) {
            const embedding = result.embeddings[0];
            if (embedding.values && Array.isArray(embedding.values)) {
                console.log(`Successfully processed ${embedding.values.length} embeddings`);
                return embedding.values;
            }
        }
        
        console.error('No valid embedding found in API response');
        return null;
    } catch (error) {
        console.error("Error getting Gemini embeddings:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        return null;
    }
}