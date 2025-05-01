import { GoogleGenAI } from '@google/genai';
import { Message } from "ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Remove edge runtime directive to allow Node.js modules to work
// export const runtime = "edge";

// Initialize Google Gemini client (same as in embeddings.ts)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    
    // Get context with error handling for null return
    const context = await getContext(lastMessage.content, fileKey);
    if (context === null) {
      console.error("Failed to get context for query:", lastMessage.content);
      return NextResponse.json({ error: "Failed to retrieve context" }, { status: 500 });
    }

    // Save user message to database
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });

    // Prepare conversation text including context and history
    let conversationText = `Instructions for the AI assistant:
AI assistant is a brand new, powerful, human-like artificial intelligence.
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
AI is a well-behaved and well-mannered individual.
AI is always friendly, kind, and inspiring, and eager to provide vivid and thoughtful responses.
AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question.
AI assistant is a big fan of Pinecone and Vercel.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

AI assistant will take into account the CONTEXT BLOCK above when answering questions.
If the context does not provide the answer to a question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
AI assistant will not apologize for previous responses, but instead will indicate when new information was gained.
AI assistant will not invent anything that is not drawn directly from the context.

Conversation history:
`;

    // Add conversation history
    messages.forEach((message: Message, index: number) => {
      if (index < messages.length - 1) { // Skip the last message as we'll add it separately
        const role = message.role === "user" ? "User" : "Assistant";
        conversationText += `${role}: ${message.content}\n`;
      }
    });

    // Add the current user query
    conversationText += `User: ${lastMessage.content}\nAssistant: `;

    try {
      // Use the model similar to embeddings.ts
      console.log(`Requesting Gemini response for conversation of length ${conversationText.length}`);
      const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          role: 'user',
          parts: [{ text: conversationText }]
        }],
      });
      
      // Check if there's a valid response
      if (!result || !result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
        console.error('No valid response returned from Gemini API', result);
        throw new Error('No valid response returned from Gemini API');
      }
      
      // Extract text from the response using the correct structure
      const firstCandidate = result.candidates[0];
      // We already checked that content exists above, so it's safe to use non-null assertion here
      const contentParts = firstCandidate.content!.parts;
      
      if (!contentParts || contentParts.length === 0 || typeof contentParts[0].text !== 'string') {
        console.error('Invalid content structure in Gemini API response', firstCandidate);
        throw new Error('Invalid content structure in Gemini API response');
      }
      
      const aiResponse = contentParts[0].text;
      console.log('Generated response:', aiResponse);
      
      // Save the AI response to the database
      await db.insert(_messages).values({
        chatId,
        content: aiResponse,
        role: "system", // Using 'system' role as defined in the schema (userSystemEnum)
      });

      // Return the response in a format that works well with streaming
      return new Response(aiResponse, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
        },
      });
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      return NextResponse.json({ error: "Failed to generate response from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "An error occurred during the chat request" }, { status: 500 });
  }
}