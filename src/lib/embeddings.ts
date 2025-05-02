import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getEmbeddings(text: string): Promise<number[] | null> {
    try {
        // Clean up newline characters and ensure text isn't too long
        text = text.replace(/\n/g, " ");
        
        // Gemini has token limits - truncate if necessary
        if (text.length > 5000) {
            text = text.substring(0, 5000);
        }
        
        console.log(`Requesting embeddings for text of length ${text.length}`);
        
        const result = await ai.models.embedContent({
            model: 'gemini-embedding-exp-03-07',
            contents: {
                role: "user",
                parts: [{ text }]
            },
        });
        
        // Detailed logging of the response structure for debugging
        console.log('Embeddings result received:', JSON.stringify(result, null, 2).substring(0, 200) + '...');
        
        // Cast the result to any to handle different response structures
        const anyResult = result as any;
        
        // In newer Gemini API versions, embeddings might be in result.embedding
        if (anyResult.embedding) {
            const embeddingArray = Array.isArray(anyResult.embedding) ? anyResult.embedding : [];
            console.log(`Successfully processed ${embeddingArray.length} embeddings from embedding property`);
            return embeddingArray.map(Number);
        }
        
        // For older API versions or alternative response formats
        if (result.embeddings) {
            try {
                // Navigate through possible structures
                const embeddings = result.embeddings as any;
                
                // Check if embeddings is an array with values property
                if (Array.isArray(embeddings) && embeddings.length > 0) {
                    if (embeddings[0].values) {
                        const values = embeddings[0].values;
                        console.log(`Successfully processed ${values.length} embeddings from array[0].values`);
                        return Array.isArray(values) ? values.map(Number) : [];
                    }
                }
                
                // Check if embeddings has a direct values property
                if (embeddings.values) {
                    const values = embeddings.values;
                    console.log(`Successfully processed ${values.length} embeddings from direct values property`);
                    return Array.isArray(values) ? values.map(Number) : [];
                }
                
                // Check if embeddings is directly an array of numbers
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
