import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getEmbeddings(text: string) {
    try {
        const model = client.getGenerativeModel({ model: "gemini-embedding-exp-03-07"});
        const response = await model.embedContent(text.replace(/\n/g, " "));
        
        console.log(response);
        return response.embedding.values;
    } catch (error) {
        console.error("error getting Gemini embeddings", error);
        throw error;
    }
}