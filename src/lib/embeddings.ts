import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEmbeddings(text: string): Promise<number[] | null> {
    try {
        text = text.replace(/\n/g, " ");
        
        if (text.length > 5000) {
            text = text.substring(0, 5000);
        }
        
        console.log(`Requesting embeddings for text of length ${text.length}`);
        
        const result = await ai.models.embedContent({
            model: 'text-embedding-004',
            contents: {
                role: "user",
                parts: [{ text }]
            },
        });
        
        console.log('Embeddings result received:', JSON.stringify(result, null, 2).substring(0, 200) + '...');
        
        const anyResult = result as any;
        
        if (anyResult.embedding) {
            const embeddingArray = Array.isArray(anyResult.embedding) ? anyResult.embedding : [];
            console.log(`Successfully processed ${embeddingArray.length} embeddings from embedding property`);
            return embeddingArray.map(Number);
        }
        
        if (result.embeddings) {
            try {
                const embeddings = result.embeddings as any;
                
                if (Array.isArray(embeddings) && embeddings.length > 0) {
                    if (embeddings[0].values) {
                        const values = embeddings[0].values;
                        console.log(`Successfully processed ${values.length} embeddings from array[0].values`);
                        return Array.isArray(values) ? values.map(Number) : [];
                    }
                }
                
                if (embeddings.values) {
                    const values = embeddings.values;
                    console.log(`Successfully processed ${values.length} embeddings from direct values property`);
                    return Array.isArray(values) ? values.map(Number) : [];
                }
                
                if (Array.isArray(embeddings) && embeddings.length > 0) {
                    console.log(`Successfully processed ${embeddings.length} embeddings from direct array`);
                    return embeddings.map(Number);
                }
                
                console.error('Could not find embeddings in expected structures, response:', 
                    JSON.stringify(embeddings).substring(0, 100) + '...');
                return null;
            } catch (arrayError) {
                console.error('Error processing embedding values:', arrayError);
                return null;
            }
        }
        
        console.error('No recognizable embedding format found in API response');
        return null;
    } catch (error) {
        console.error("Error getting Gemini embeddings:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        return null;
    }
}
